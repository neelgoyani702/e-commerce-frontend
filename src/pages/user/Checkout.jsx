import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import {
  IndianRupee,
  MapPin,
  Plus,
  CheckCircle2,
  Package,
  ShieldCheck,
  Truck,
  CreditCard,
  Check,
  Tag,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
} from "../../components/ui/dialog";
import AddAddress from "../../components/AddAddress";
import { SkeletonCheckout } from "../../components/SkeletonCard";

function Checkout() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" | "online"

  // Load Razorpay checkout.js script lazily
  function loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Fetch cart
  async function getCart() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.cart && data.cart.products?.length > 0) {
        setCart(data.cart);
      } else {
        toast.error("Your cart is empty");
        navigate("/checkout/cart");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    }
  }

  // Fetch addresses
  async function getAddresses() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/get-address`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok && data.address) {
        setAddresses(data.address);
        if (data.address.length > 0) {
          setSelectedAddress(data.address[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  }

  // COD order placement
  async function handleCOD() {
    if (!selectedAddress) return toast.error("Please select a delivery address");
    try {
      setPlacingOrder(true);
      const toastId = toast.loading("Placing your order...");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ couponCode: appliedCoupon?.code || null, paymentMethod: "cod" }),
      });
      toast.dismiss(toastId);
      const data = await response.json();
      if (response.ok) {
        toast.success("Order placed! 🎉");
        navigate("/order-confirmation", { state: { order: data.savedOrder } });
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPlacingOrder(false);
    }
  }

  // Online payment via Razorpay
  async function handlePayOnline() {
    if (!selectedAddress) return toast.error("Please select a delivery address");
    const loaded = await loadRazorpayScript();
    if (!loaded) return toast.error("Failed to load payment gateway. Check your internet connection.");

    try {
      setPlacingOrder(true);
      const finalAmount = (cart.totalAmount || 0) - (appliedCoupon?.discount || 0);

      // Step 1: Create Razorpay order on backend (no app order yet)
      const orderRes = await fetch(`${process.env.REACT_APP_API_URL}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: finalAmount }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { toast.error(orderData.message || "Payment initiation failed"); setPlacingOrder(false); return; }

      // Step 2: Open Razorpay popup FIRST (no app order created yet)
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ShopEasy",
        description: "Online Payment",
        order_id: orderData.orderId,
        prefill: {
          name: user?.firstName + " " + (user?.lastName || ""),
          email: user?.email || "",
        },
        theme: { color: "#6366f1" },
        handler: async (response) => {
          // Step 3: Payment succeeded — NOW create the app order
          const toastId = toast.loading("Confirming your order...");
          try {
            const appOrderRes = await fetch(`${process.env.REACT_APP_API_URL}/order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ couponCode: appliedCoupon?.code || null, paymentMethod: "online" }),
            });
            const appOrderData = await appOrderRes.json();
            toast.dismiss(toastId);

            if (!appOrderRes.ok) {
              toast.error(appOrderData.message || "Failed to create order");
              setPlacingOrder(false);
              return;
            }

            const appOrderId = appOrderData.savedOrder?._id;

            // Step 4: Verify payment and link to app order
            const verifyRes = await fetch(`${process.env.REACT_APP_API_URL}/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appOrderId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              toast.success("Payment successful! Order confirmed 🎉");
              navigate("/order-confirmation", { state: { order: appOrderData.savedOrder } });
            } else {
              toast.error(verifyData.message || "Payment verification failed");
            }
          } catch {
            toast.dismiss(toastId);
            toast.error("Order confirmation failed. Contact support.");
          }
          setPlacingOrder(false);
        },
        modal: { ondismiss: () => { toast.info("Payment cancelled — no order was placed."); setPlacingOrder(false); } },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Something went wrong");
      setPlacingOrder(false);
    }
  }

  // Unified handler
  function placeOrder() {
    if (paymentMethod === "online") return handlePayOnline();
    return handleCOD();
  }

  const handleAddAddress = (address) => {
    setAddresses([...addresses, address]);
    setSelectedAddress(address._id);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    getCart();
    getAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  if (!user) return null;

  // Stepper component
  const steps = [
    { label: "Cart", done: true },
    { label: "Checkout", done: true, active: true },
    { label: "Confirmation", done: false },
  ];

  return (
    <div className="md:mt-16 mt-32 min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-store-primary/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-store-primary/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-20">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <Link to="/checkout/cart" className="hover:text-white transition-colors">Cart</Link>
            <span className="text-gray-600">/</span>
            <span className="text-store-primary font-medium">Checkout</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-store-gradient flex items-center justify-center shadow-lg shadow-store-primary">
              <CreditCard className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Checkout</h1>
              <p className="text-gray-400 mt-1">Complete your order</p>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-center gap-0">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step.done
                  ? "bg-store-gradient text-white shadow-md shadow-store-primary"
                  : "bg-gray-100 text-gray-400"
                  }`}>
                  {step.done ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:inline ${step.active ? "text-gray-900" : step.done ? "text-gray-600" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-3 rounded-full ${step.done ? "bg-store-primary" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Loading */}
      {(loading || !cart) && <SkeletonCheckout />}

      {/* Content */}
      {!loading && cart && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-1 space-y-6">
              {/* Delivery Address Section */}
              <div className="rounded-2xl border border-gray-100 p-6 bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-store-primary-light flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-store-primary" />
                  </div>
                  <h2 className="text-lg font-bold">Delivery Address</h2>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <MapPin className="h-7 w-7 text-gray-300" />
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      No addresses found. Please add one.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="inline-flex items-center gap-2 bg-store-gradient text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-store-primary hover:shadow-store-primary-lg">
                          <Plus className="h-4 w-4" />
                          Add Address
                        </button>
                      </DialogTrigger>
                      <AddAddress handleAddAddress={handleAddAddress} />
                    </Dialog>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => setSelectedAddress(address._id)}
                        className={`rounded-xl p-4 cursor-pointer transition-all duration-200 border-2 ${selectedAddress === address._id
                          ? "border-store-primary bg-store-primary/5 shadow-sm"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm">
                                {address.fullName || user.firstName}
                              </h3>
                              {selectedAddress === address._id && (
                                <CheckCircle2 className="h-4 w-4 text-store-primary" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                              {address.houseNo && `${address.houseNo}, `}
                              {address.area}<br />
                              {address.city}, {address.state} - {address.pinCode}<br />
                              {address.country}
                            </p>
                            {(address.phone || user.phone) && (
                              <p className="text-xs text-gray-400 mt-2">
                                📞 {address.phone || user.phone}
                              </p>
                            )}
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${selectedAddress === address._id
                              ? "border-store-primary"
                              : "border-gray-300"
                              }`}
                          >
                            {selectedAddress === address._id && (
                              <div className="w-3 h-3 rounded-full bg-store-primary"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="w-full border-2 border-dashed border-gray-200 rounded-xl p-3.5 text-gray-400 hover:text-store-primary hover:border-store-primary transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                          <Plus className="h-4 w-4" />
                          Add New Address
                        </button>
                      </DialogTrigger>
                      <AddAddress handleAddAddress={handleAddAddress} />
                    </Dialog>
                  </div>
                )}
              </div>

              {/* Order Items Section */}
              <div className="rounded-2xl border border-gray-100 p-6 bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-store-primary-light flex items-center justify-center">
                    <Package className="h-5 w-5 text-store-primary" />
                  </div>
                  <h2 className="text-lg font-bold">
                    Order Items ({cart.products?.length || 0})
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {cart.products?.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <img
                        className="h-20 w-20 object-cover rounded-xl bg-gray-50"
                        src={item?.productId?.image}
                        alt={item?.productId?.name}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm capitalize">
                          {item.productId?.name}
                        </h3>
                        {item.variantLabel && (
                          <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{item.variantLabel}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                        <div className="flex items-center mt-1.5">
                          <IndianRupee className="h-3.5 w-3.5" />
                          <span className="font-bold text-sm">{item.price?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-96">
              <div className="rounded-2xl border border-gray-100 p-6 bg-white shadow-sm sticky top-28">
                <h2 className="text-lg font-bold mb-5">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Items ({cart.totalItems})
                    </span>
                    <div className="flex items-center font-medium">
                      <IndianRupee className="h-3.5 w-3.5" />
                      <span>{cart.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>

                  {/* Coupon / Promo Code */}
                  <div className="border-t border-dashed border-gray-200 my-3" />
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-green-600" />
                        <div>
                          <span className="text-xs font-bold text-green-700">{appliedCoupon.code}</span>
                          <p className="text-[10px] text-green-600">
                            {appliedCoupon.discountType === "percentage"
                              ? `${appliedCoupon.discountValue}% off`
                              : `₹${appliedCoupon.discountValue} off`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setAppliedCoupon(null); setCouponCode(""); toast.success("Coupon removed"); }}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Promo code"
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-xs font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-store-primary/20 focus:border-store-primary uppercase"
                        />
                      </div>
                      <button
                        onClick={async () => {
                          if (!couponCode.trim()) return;
                          setValidatingCoupon(true);
                          try {
                            const res = await fetch(`${process.env.REACT_APP_API_URL}/coupon/validate`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              credentials: "include",
                              body: JSON.stringify({ code: couponCode, orderAmount: cart.totalAmount }),
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setAppliedCoupon(data.coupon);
                              toast.success(data.message);
                            } else {
                              toast.error(data.message);
                            }
                          } catch { toast.error("Failed to validate coupon"); }
                          finally { setValidatingCoupon(false); }
                        }}
                        disabled={!couponCode.trim() || validatingCoupon}
                        className="px-4 py-2.5 text-xs font-semibold text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(to right, var(--store-primary, #eab308), var(--store-accent, #f59e0b))' }}
                      >
                        {validatingCoupon ? "..." : "Apply"}
                      </button>
                    </div>
                  )}

                  {/* Discount line */}
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Coupon Discount</span>
                      <div className="flex items-center font-medium text-green-600">
                        −<IndianRupee className="h-3.5 w-3.5" />
                        <span>{appliedCoupon.discount?.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-dashed border-gray-200 my-3" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      <span>{((cart.totalAmount || 0) - (appliedCoupon?.discount || 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Method</p>
                  {[
                    { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: "🏠" },
                    { id: "online", label: "Pay Online", desc: "UPI, Cards, Netbanking via Razorpay", icon: "💳" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full text-left flex items-center gap-3 rounded-xl p-3 border-2 transition-all ${
                        paymentMethod === m.id ? "border-store-primary bg-store-primary/5" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <span className="text-lg">{m.icon}</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900">{m.label}</p>
                        <p className="text-[10px] text-gray-400">{m.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === m.id ? "border-store-primary" : "border-gray-300"
                      }`}>
                        {paymentMethod === m.id && <div className="w-2 h-2 rounded-full bg-store-primary" />}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  className={`w-full mt-6 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-base ${placingOrder || !selectedAddress
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-store-gradient hover:bg-store-gradient-light text-white shadow-lg shadow-store-primary hover:shadow-store-primary-lg"
                    }`}
                  onClick={placeOrder}
                  disabled={placingOrder || !selectedAddress}
                >
                  {placingOrder ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Placing Order...
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </button>

                {/* Trust badges */}
                <div className="mt-6 space-y-2.5">
                  {[
                    { icon: ShieldCheck, text: "100% secure payment", color: "text-green-500" },
                    { icon: Truck, text: "Free delivery on all orders", color: "text-store-primary" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-gray-400">
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
