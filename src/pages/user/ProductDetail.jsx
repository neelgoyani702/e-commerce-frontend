import React from 'react'
import { useParams } from 'react-router-dom';

function ProductDetail() {

  const { productId } = useParams();

  return (
    <div className='mt-24'>
      product id : {productId}
    </div>
  )
}

export default ProductDetail