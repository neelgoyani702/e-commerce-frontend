import React, { useEffect, useState } from "react";
import CategoryCard from '../../components/CategoryCard.jsx';


function Category() {
    const [category, setCategory] = useState([]);

    async function getCategory() {
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

        const data = await response.json();
        console.log(data.categories);

        if (response.ok) {


            setCategory(data.categories);
        } else {
            alert("Error: ", data.message);
        }
    }

    useEffect(() => {
        getCategory();
    }, []);

    return (
        <>
            <div className="py-24 mx-5 relative">
                <div className="font-[Caveat] font-extrabold text-5xl">
                    All
                    <span className="z-10">&nbsp;Categories</span>
                </div>
                <div className="grid grid-cols-4 gap-4 my-4">
                    {category.map((category) => (
                        <CategoryCard key={category._id} category={category} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Category