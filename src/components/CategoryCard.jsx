import React from 'react'

function CategoryCard({ category }) {
    return (
        <>
            <div className="max-w-sm rounded overflow-hidden shadow-lg p-2">
                <img className="w-full min-h-36 max-h-64 rounded" width={200} height={200} src={category.image} alt="category image" />
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2 text-center">{category.name}</div>
                </div>
            </div>
        </>
    )
}

export default CategoryCard
