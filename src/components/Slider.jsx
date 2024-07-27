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
      "https://images.unsplash.com/photo-1721655799196-7c50607778a9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Image 1",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1721905126607-6700881aaa95?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Image 2",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1698138819865-88d3add4838f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Image 3",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1721655799196-7c50607778a9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Image 4",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1721655799196-7c50607778a9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Image 5",
  },
];

export default function Slider() {
  return (
    <div className="w-screen ">
      <Carousel className="relative w-full">
        <CarouselContent>
          {ImageArray.map((_, index) => (
            <CarouselItem key={index}>
              <div className="flex flex-col items-center justify-center w-full bg-cover bg-center bg-no-repeat h-96 p-5">
                <img
                  src={_.imageUrl}
                  alt={_.alt}
                  className="h-full w-full object-cover"
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
