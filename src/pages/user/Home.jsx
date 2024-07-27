import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Slider from '../../components/Slider.jsx'

function Home() {
    return (
        <div className='py-32 md:py-20'>
            <Navbar />
            <Slider />
            Home
        </div>
    )
}

export default Home
