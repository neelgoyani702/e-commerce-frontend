import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select"
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

function CategoryProducts() {

    const { categoryId } = useParams();
    console.log("categoryId", categoryId);

    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [sort, setSort] = useState("name asc");

    async function getCategoryProducts() {

        try {
            const toastId = toast.loading("Fetching Products...");
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/category/${categoryId}/products`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );
            toast.dismiss(toastId);
            const data = await response.json();

            if (response.ok) {
                setProducts(data.products);
                setCategory(data.category);
                toast.success(data.category.name + " fetched successfully");
            } else {
                console.log("Error in get category products");
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error: in get category products", error);
            toast.error("something went wrong");
        }
    }

    useEffect(() => {
        getCategoryProducts();
    }, []);

    const handleValueChange = (value) => {

        setSort(value);
        if (value === "name asc") {
            setProducts([...products].sort((a, b) => a.name.localeCompare(b.name)));
        } else if (value === "name desc") {
            setProducts([...products].sort((a, b) => b.name.localeCompare(a.name)));
        } else if (value === "price asc") {
            setProducts([...products].sort((a, b) => a.price - b.price));
        } else if (value === "price desc") {
            setProducts([...products].sort((a, b) => b.price - a.price));
        }

    }

    return (
        <div className='py-24 mx-5'>
            <div className="h-96 relative w-full overflow-hidden bg-none bg-cover bg-center hover:scale-105 duration-500">
                <div className="absolute w-full -top-[50%]">
                    <img
                        src={category.image}
                        alt="category"
                        className="w-full 
                        duration-500
                        object-cover object-center"
                    />
                </div>
            </div>
            <div className="my-14 mx-10">
                <div className="my-10">
                    <div className=" p-2 my-2 font-thin">
                        <p className="">Filter Categories : </p>
                    </div>
                    <hr className="" />
                    <div className=" p-2 my-2 font-thin">
                        <Select value={sort || 'name asc'} onValueChange={handleValueChange}>
                            <SelectTrigger className="w-[180px] hover:cursor-pointer">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Sorting</SelectLabel>
                                    <SelectItem value="name asc">name ascending</SelectItem>
                                    <SelectItem value="name desc">name descending</SelectItem>
                                    <SelectItem value="price asc">price low to high</SelectItem>
                                    <SelectItem value="price desc">price high to low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-5 my-10">
                    {products.map((product) => (
                        <Link to={`/product/${product._id}`} key={product._id}>
                            <ProductCard product={product} key={product._id} />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CategoryProducts