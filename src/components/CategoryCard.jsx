import React from 'react'

function CategoryCard({ category }) {
    return (
        <>
            <div className="items-center p-5 border hover:scale-105 transition-transform duration-500 cursor-pointer">
                <img className="w-full object-cover object-center h-64" width={200} height={200} src={category.image} alt="category" />
                <div className="flex justify-center items-center mt-5">
                    <div className="font-normal text-lg text-center">{category.name}</div>
                </div>
            </div>
        </>
    )
}

export default CategoryCard
