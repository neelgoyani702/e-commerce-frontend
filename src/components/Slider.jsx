import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const ImageArray = [
  {
    imageUrl:
      "https://img.freepik.com/free-photo/portrait-young-woman-freelancer-working-from-home-saleswoman-doing-trading-from-her-kitchen-set_1258-202373.jpg?t=st=1724522932~exp=1724526532~hmac=9c396b99b39c9e47507f525e0604d8160bcbdccbb0eafd24a1dc9486805c5038&w=1800",
    alt: "Image 1",
  },
  {
    imageUrl:
      "https://img.freepik.com/free-vector/pair-realistic-black-sneakers-with-shadow-isolated_548887-96.jpg?t=st=1724523063~exp=1724526663~hmac=5317d9dbdc768c9284c6ebbdbb9ca28c49a9444a72eafcbc1d934aa2a66cf154&w=1800",
    alt: "Image 2",
  },
  {
    imageUrl:
      "https://img.freepik.com/free-photo/portrait-man-shopping-buying-consumer-goods_23-2151669723.jpg?t=st=1724523111~exp=1724526711~hmac=b88d626ab5bf43a1b5765f13121fcfb75b807cc9e5eebabb76a5c4605126481e&w=1800",
    alt: "Image 3",
  },
  {
    imageUrl:
      "https://img.freepik.com/free-vector/flat-design-minimal-book-club-twitch-banner_23-2149694095.jpg?t=st=1724523146~exp=1724526746~hmac=e0dcf628d11f84372c4f1d2c9912fa4800b58597b9f289bd9ec655048dbd4a60&w=1800",
    alt: "Image 4",
  },
];

export default function Slider() {
  return (
    <div className="w-screen">
      <Carousel className="relative w-full">
        <CarouselContent>
          {ImageArray.map((_, index) => (
            <CarouselItem key={index}>
              <div className="flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat h-96 p-5">
                <img
                  src={_.imageUrl}
                  alt={_.alt}
                  className="h-full w-full object-cover hover:scale-105 duration-500"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute top-1/2 left-0 transform -translate-y-1/2" />
        <CarouselNext className="absolute top-1/2 right-0 transform -translate-y-1/2" />
      </Carousel>
    </div>
  );
}
