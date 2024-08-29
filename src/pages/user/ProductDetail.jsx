import { ShoppingCart } from "lucide-react";
import { Button } from "../../components/ui/button";
import { IndianRupee } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { Star } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState({});

  async function getProduct() {
    try {
      const toastId = toast.loading("fetching product...");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/product/get-product/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      toast.dismiss(toastId);

      const data = await response.json();

      if (!response.ok) {
        console.log("Error in getProduct");
        toast.error(data.message || "Failed to fetch product");
        return;
      }
      if (data.product) {
        setProduct(data.product);
        console.log("Product fetched successfully", data.product.category.name);
        // toast.success(data.message || "Product fetched successfully");
      }
    } catch (error) {
      console.log("Error : in getProduct", error);
      toast.error("something went wrong");
    }
  }

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="md:mt-24 mt-36 w-full">
      <div className="flex flex-col lg:flex-row justify-center item-center gap-10 lg:gap-5 mx-10 my-10">
        <div className="lg:w-6/12 flex justify-center item-center">
          <div className="m-2 px-5">
            <img
              className="h-64 w-64 sm:h-96 sm:w-96 lg:h-[500px] xl:h-[600px] lg:w-fit object-cover object-center rounded-lg"
              width={256}
              height={256}
              src={product.image}
              alt="product"
            />
          </div>
        </div>
        <div className="lg:w-6/12">
          <div className="flex flex-col gap-5 m-2 px-5">
            <div className="flex flex-col">
              <h1 className="text-4xl capitalize font-medium">
                {product.name}
              </h1>
              <small className="text-gray-500 ml-2">
                {product?.category?.name?.toUpperCase()}
              </small>
              <div className="flex item-center mt-5">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
                <span className="ml-2 text-xl">5.0</span>
              </div>
            </div>
            <hr className="my-2" />
            <div className="flex flex-col">
              <div className="flex item-center">
                <IndianRupee className="h-5 w-5 my-1" />
                <h3 className="text-xl capitalize font-medium">
                  {product.price}
                </h3>
              </div>
              <small className="text-gray-500 ml-2">
                inclusive of all taxes
              </small>
            </div>
            <div className="">
              <h1 className="text-xl my-2">Select Size :</h1>
              <div className="flex flex-row flex-wrap gap-5">
                {product?.size ? (
                  Array.of(product.size).map((size, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      className="border hover:border-slate-500 hover:scale-105 duration-500 py-2 px-4 rounded-2xl"
                    >
                      {size}
                    </Button>
                  ))
                ) : (
                  <button className="border rounded-xl border-slate-500 hover:scale-105 py-2 px-4">
                    One Size
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-5 my-5 justify-center flex-wrap item-center">
              <Button className="flex gap-3 text-xl py-7 px-10 bg-yellow-600 hover:bg-yellow-500 duration-500 border border-transparent">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                className="flex gap-3 text-xl py-7 px-10 duration-500 border border-slate-400 hover:border-slate-300"
              >
                <Heart className="h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>
            <hr className="my-2" />
            <div className="flex flex-col">
              <Accordion type="single" collapsible className="w-full">
                {product?.description && (
                  <AccordionItem value="description">
                    <AccordionTrigger>Description</AccordionTrigger>
                    <AccordionContent>{product.description}</AccordionContent>
                  </AccordionItem>
                )}
                {product?.bulletPoints && (
                  <AccordionItem value="details">
                    <AccordionTrigger>Details</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-outside">
                        {product.bulletPoints.map((point, index) => (
                          <li className="list-decimal gap-2" key={index}>
                            &#8226; {point}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
