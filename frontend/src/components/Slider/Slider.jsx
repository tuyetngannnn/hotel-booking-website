import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "../Slider/Slider.css";
import img2 from "../../assets/images/img2.jpg";
import img3 from "../../assets/images/img3.jpg";
import img4 from "../../assets/images/img4.jpg";
import img5 from "../../assets/images/img5.jpg";
import "swiper/css"; // Import CSS cho Swiper
import "swiper/css/effect-coverflow";
import { ArrowLeft, ArrowRight } from "phosphor-react";
const Slider = () => {
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
          <img src={img2} alt="img" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={img3} alt="img" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={img4} alt="img" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={img5} alt="img" />
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
export default Slider;
