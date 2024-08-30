import React from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner';

function AddToCart(props) {

    const { product, quantity, ATC, handleChangeCartItems } = props;

    const addToCart = async () => {

        try {

            const toastId = toast.loading("Adding to cart...");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    productId: product._id,
                    quantity: quantity || 1,
                    ATC: ATC || false
                })
            });
            toast.dismiss(toastId);

            const data = await response.json();

            if (!response.ok) {
                console.log("Error in add to cart");
                toast.error(data.message || "Failed to add to cart");
                return;
            }
            if (data.cart) {
                toast.success(data.message || "Product added to cart");
                console.log("Cart fetched successfully", data.cart);
                if (!ATC) {
                    handleChangeCartItems(product, quantity);
                }
            }

        } catch (error) {
            console.log("Error: in add to cart", error);
            toast.error("Something went wrong");
        }

        console.log("Product added to cart", product);
    }

    return (
        <Button
            asChild
            onClick={addToCart}
        >
            {props.children}
        </Button>
    )
}

export default AddToCart