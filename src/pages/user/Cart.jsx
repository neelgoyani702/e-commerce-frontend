import React, { useState, useEffect, useContext, useRef } from 'react'
import { AuthContext } from "../../context/AuthProvider";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { IndianRupee } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { ChevronDown } from 'lucide-react';
import AddToCart from '../../components/AddToCart';
import DeleteFromCart from '../../components/DeleteFromCart';


const quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function Cart() {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const ref = useRef(null);

  const [cart, setCart] = useState([]);
  const [addToCartQuantity, setAddToCartQuantity] = useState(1);

  async function getCart() {
    try {

      const toastId = toast.loading("Fetching Cart...");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      toast.dismiss(toastId);

      const data = await response.json();

      if (!response.ok) {
        console.log("Error in get cart");
        toast.error(data.message || "Failed to fetch cart");
        return;
      }

      if (data.cart) {
        setCart(data.cart);
        console.log("Cart fetched successfully", data.cart);
      }

    } catch (error) {
      console.log("Error: in get cart", error);
      toast.error("Something went wrong");
    }
  }

  const handleChangeCartItems = async (product, quantity) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      const index = newCart.products.findIndex((p) => p.productId._id === product._id);
      newCart.products[index].quantity = quantity;
      newCart.products[index].price = product.price * quantity;
      newCart.totalAmount = newCart.products.reduce((acc, p) => acc + p.price, 0);
      newCart.totalItems = newCart.products.length;
      return newCart;
    });
    ref.current.click();
  };

  const handleDeleteCartItems = async (productId) => {

    setCart((prevCart) => {
      const newCart = { ...prevCart };
      const index = newCart.products.findIndex((p) => p.productId._id === productId);
      newCart.products.splice(index, 1);
      newCart.totalAmount = newCart.products.reduce((acc, p) => acc + p.price, 0);
      newCart.totalItems = newCart.products.length;
      return newCart;
    });
  }

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  useEffect(() => {
    getCart();
  }, []);

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className='mt-24'>
      <div className='flex border m-10 justify-center items-center gap-10'>
        <div className='flex flex-col w-7/12 border-r justify-center p-10'>
          <div className='my-10'>
            <h1 className='items-start text-2xl font-light'>
              Shoping Cart
            </h1>
          </div>
          {cart?.products?.length > 0 ? (
            <div className='flex flex-col gap-5'>
              {cart?.products?.map((product, index) => (
                <div key={product._id} className='rounded-lg p-2 flex flex-row w-full border justify-between'>
                  <div key={product._id} className='flex flex-1 gap-5 p-2'>
                    <div className=''>
                      <img className="h-40 w-32 object-cover object-center rounded-lg" width={100} height={100} src={product?.productId?.image} alt="category" />
                    </div>
                    <div className='flex flex-col gap-3'>
                      <div>
                        <h1 className='text-xl capitalize'>{product.productId.name}</h1>
                      </div>
                      <div className='flex gap-1'>
                        <IndianRupee className='h-4 w-4 mt-1' />
                        <h1 className='text-base capitalize'>{product.price}</h1>
                      </div>
                      <div className='flex gap-3 justify-center items-center'>
                        <div className="">Quantity : </div>
                        <div className=" font-thin">
                          <Dialog>
                            <DialogTrigger>
                              <Button variant="outline" type='button' className="flex gap-2" onClick={() => setAddToCartQuantity(product.quantity)}>
                                {product.quantity}
                                <ChevronDown className='h-4 w-4' />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[300px]">
                              <DialogHeader>
                                <DialogTitle>Select Quantity</DialogTitle>
                              </DialogHeader>
                              <DialogDescription>
                                Select the quantity of the product
                              </DialogDescription>
                              <div className='flex flex-col gap-5'>
                                <div className='flex justify-center items-center flex-row flex-wrap gap-1'>
                                  {
                                    quantity.map((q) => (
                                      <Button
                                        variant="outline"
                                        key={q}
                                        onClick={() => {
                                          setAddToCartQuantity(q);
                                        }}
                                        className={`rounded-full text-xs ${addToCartQuantity === q ? 'bg-yellow-500 text-white' : ''}`}>
                                        {q}
                                      </Button>
                                    ))
                                  }
                                </div>

                                <AddToCart
                                  product={product.productId}
                                  quantity={addToCartQuantity}
                                  ATC={false}
                                  handleChangeCartItems={handleChangeCartItems}
                                >
                                  <Button className="bg-yellow-600 hover:bg-yellow-500">
                                    Done : {addToCartQuantity}
                                  </Button>
                                </AddToCart>
                              </div>
                              <DialogClose asChild className="hidden">
                                <Button type="button" variant="secondary" ref={ref}>
                                  Close
                                </Button>
                              </DialogClose>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='p-0 m-0'>
                    <DeleteFromCart 
                    productId={product.productId} 
                    handleDeleteCartItems={handleDeleteCartItems}/>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex justify-center items-center'>No items in cart</div>
          )}
        </div>
        <div className='flex flex-col justify-center items-center w-5/12'>
          <div>
            <h1> totalAmount : {cart.totalAmount}</h1>
          </div>
          <div>
            <h1> totalItems :  {cart.totalItems}</h1>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Cart