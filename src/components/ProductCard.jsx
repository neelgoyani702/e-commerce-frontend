import React from 'react'

function ProductCard({ product }) {

    const { name, description, price, image } = product;

    return (
        <>
            <div className=" pb-10 items-center border hover:scale-105 transition-transform duration-500 cursor-pointer rounded-md">
                <div className='flex flex-col justify-center items-center p-5 m-2 gap-3'>
                    <div className='mb-4'>
                        <img className="w-full object-cover object-center h-64 rounded-md" width={256} height={256} src={image} alt="product" />
                    </div>
                    <div className='flex justify-between gap-2 items-center w-full h-full'>
                        <div className="font-light text-lg text-justify">
                            <p className='capitalize'>{name.length > 17 ? name.slice(0, 17) + '...' : name}</p>
                        </div>
                        <div className="font-light text-lg">
                            <p className=''> &#x20B9; {price}</p>
                        </div>
                    </div>
                    <div className='h-10'>
                        <p className="text-sm text-justify font-thin">{description.length > 80 ? description.slice(0, 80) + '...' : description}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductCard
