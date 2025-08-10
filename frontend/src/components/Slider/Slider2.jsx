import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "../Slider/Slider.css";
import img6 from "../../assets/images/img6.jpg";
import img7 from "../../assets/images/img7.jpg";
import img8 from "../../assets/images/img8.jpg";
import img9 from "../../assets/images/img9.jpg";
import "swiper/css"; // Import CSS cho Swiper
import "swiper/css/effect-coverflow";
import { ArrowLeft, ArrowRight } from "phosphor-react";
const Slider2 = () => {
  return (
    <div className="slider-container">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={1.5}
        coverflowEffect={{
          rotate: 0,
          stretch: -20,
          depth: 100,
          modifier: 3.5,
          slideShadows: false,
        }}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
          clickable: true,
        }}
        modules={[EffectCoverflow, Navigation]}
      >
        <SwiperSlide>
          <img src={img6} alt="img" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={img7} alt="img" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={img8} alt="img" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={img9} alt="img" />
        </SwiperSlide>
        <div className="slider-nav">
          <div className="swiper-button-prev slider-arrow">
            <ArrowLeft size={20} />
          </div>
          <div className="swiper-button-next">
            <ArrowRight size={20} />
          </div>
        </div>
      </Swiper>
    </div>
  );
};
export default Slider2;
