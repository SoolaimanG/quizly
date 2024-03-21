import { FC, ReactElement } from "react";
import { Navigation, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { Img } from "react-image";
import { Skeleton } from "../Loaders/Skeleton";
import { cn } from "../../lib/utils";

export const ImageCarosel: FC<{
  images: string[];
  className?: string;
  slidePerView: number;
  imageClassName?: string;
  swiperClassName?: string;
  element?: ReactElement;
  onElementClick: (index: number) => void;
}> = ({
  images,
  element,
  className,
  slidePerView,
  imageClassName,
  onElementClick,
  swiperClassName,
}) => {
  return (
    <Swiper
      className={swiperClassName}
      modules={[Navigation, A11y]}
      spaceBetween={15}
      slidesPerView={slidePerView}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        0: {
          slidesPerView: 1,
        },
        767: {
          slidesPerView: slidePerView,
        },
      }}
      autoplay={{ delay: 2000 }}
    >
      {images?.map((image, index) => (
        <SwiperSlide className={cn("w-full", className)} key={index}>
          <div onClick={() => onElementClick(index)}>{element}</div>
          <Img
            className={cn("rounded-md w-full h-[16rem]", imageClassName)}
            loader={<Skeleton className="w-full h-[16rem] rounded-md" />}
            src={image}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
