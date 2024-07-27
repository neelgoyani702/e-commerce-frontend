import React from "react";
import Slider from "../../components/Slider.jsx";
import HomeCategories from "../../components/HomeCategories.jsx";


function Home() {
  return (
    <div className="py-32 md:py-20">
      <Slider />
      <HomeCategories />
    </div>
  );
}

export default Home;
