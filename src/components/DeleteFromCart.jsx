import React from 'react'
import { X } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card"
import { Button } from './ui/button';
import { toast } from 'sonner';

function DeleteFromCart({ productId, handleDeleteCartItems }) {

  const handleDeleteFromCart = async () => {
    try {

      console.log("productId", productId._id);

      const toastId = toast.loading("Deleting from cart...");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/${productId?._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      toast.dismiss(toastId);

      const data = await response.json();

      if (!response.ok) {
        console.log("Error in delete from cart");
        toast.error(data.message || "Failed to delete from cart");
        return;
      }

      if (data.cart) {
        handleDeleteCartItems(productId._id);
        console.log("Deleted from cart successfully", data.cart);
      }

    } catch (error) {
      console.log("Error: in delete from cart", error);
      toast.error("Something went wrong");
    }
  }

  return (
    <div>
      <HoverCard>
        <HoverCardTrigger>
          <Button
            onClick={handleDeleteFromCart}
            variant="ghost"
            className="p-0 m-0 h-fit w-fit hover:bg-transparent">
            <X color='#000000' className='text-slate-400 h-6 w-6 border rounded-full hover:scale-110 duration-500 border-black' />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-40 text-sm m-0 p-2 text-center">
          Click here Remove Products From Cart
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export default DeleteFromCart