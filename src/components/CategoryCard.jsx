import React from 'react'

function CategoryCard({ category }) {
    return (
        <>
            <div className="items-center p-5 border hover:scale-105 transition-transform duration-500 cursor-pointer">
                <div className='flex flex-col justify-center items-center m-2 gap-3'>
                    <div className=''>
                        <img className="w-full object-cover object-center h-64" width={200} height={200} src={category.image} alt="category" />
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="font-normal text-lg text-center">{category.name}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CategoryCard
