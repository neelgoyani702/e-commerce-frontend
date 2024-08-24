import React, { useEffect, useState } from "react";
import CategoryCard from '../../components/CategoryCard.jsx';
import categoryImage from '../../images/ecommerce-2140603_1920.jpg';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select"
import { Link } from "react-router-dom";
import { toast } from "sonner";

function Category() {
    const [category, setCategory] = useState([]);
    const [sort, setSort] = useState("name-asc");

    async function getCategory() {
        try {
            const toastId = toast.loading("Fetching categories...");
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/category/get-category`,
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
            console.log(data.categories);

            if (response.ok) {
                setCategory(data.categories.sort((a, b) => a.name.localeCompare(b.name)));
                toast.success(data.message || "Categories fetched successfully");
            } else {
                console.log("Error in getcategory");
                toast.error(data.message || "Failed to fetch categories");
            }
        } catch (error) {
            console.log("Error: in getcategory", error);
            toast.error("something went wrong");
        }
    }

    useEffect(() => {
        getCategory();
    }, []);

    const handleValueChange = (value) => {
        setSort(value);
        if (value === "name-asc") {
            setCategory([...category].sort((a, b) => a.name.localeCompare(b.name)));
        } else if (value === "name-des") {
            setCategory([...category].sort((a, b) => b.name.localeCompare(a.name)));
        }
    }

    return (
        <>
            <div className="py-24 mx-5">
                <div className="h-96 relative w-full overflow-hidden bg-none bg-cover bg-center hover:scale-105 duration-500">
                    <div className="absolute w-full -top-[30%]">
                        <img
                            src={categoryImage}
                            alt="category"
                            className="block"
                        />
                    </div>
                    <div className=" h-96 w-full flex relative flex-wrap justify-center items-center font-[Caveat] font-extrabold text-7xl text-slate-700 hover:scale-125 duration-500">
                        <h2 className="p-5">Categories</h2>
                    </div>
                </div>

                <div className="my-14 mx-10">
                    <div className="my-10">
                        <div className=" p-2 my-2 font-thin">
                            <p className="">Filter Categories : </p>
                        </div>
                        <hr className="" />
                        <div className=" p-2 my-2 font-thin">
                            <Select value={sort} onValueChange={handleValueChange}>
                                <SelectTrigger className="w-[180px] hover:cursor-pointer">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Sorting</SelectLabel>
                                        <SelectItem value="name-asc">name ascending</SelectItem>
                                        <SelectItem value="name-des">name descending</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-5 my-10">
                        {category.map((category) => (
                            <Link to={`/category/${category._id}/products`} key={category._id}>
                                <CategoryCard key={category._id} category
                                    ={category} />
                            </Link>
                        ))}

                    </div>
                </div>

            </div>
        </>
    )
}

export default Category