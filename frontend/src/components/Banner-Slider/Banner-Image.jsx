// eslint-disable-next-line no-unused-vars
import React from 'react';
import Slider from 'react-slick';
import './Banner-Image.css'

import Slider1 from '../../assets/images/room-1.png'
import Slider2 from '../../assets/images/room-2.png'
import Slider3 from '../../assets/images/room-3.png'
import Slider4 from '../../assets/images/room-4.png'
import Slider5 from '../../assets/images/room-5.png'

const BannerSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="banner-slider">
            <Slider {...settings}>
                <div>
                    <img src={Slider1} alt="Banner 1" />
                </div>
                <div>
                    <img src={Slider2} alt="Banner 2" />
                </div>
                <div>
                    <img src={Slider3} alt="Banner 3" />
                </div>
                <div>
                    <img src={Slider4} alt="Banner 4" />
                </div>
                <div>
                    <img src={Slider5} alt="Banner 5" />
                </div>
            </Slider>
        </div>
    );
};

export default BannerSlider;
