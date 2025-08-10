import React, { useRef } from "react"; // Nhập useRef
import './Location.css';

import Branch1Image from "../../assets/images/CN_TB.jpg";
import Branch2Image from "../../assets/images/Cn_SVH.jpg";
import Branch3Image from "../../assets/images/CN_HM_1.jpg";

import Banner from "../../components/Banner/Banner";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import BacktoTop from "../../components/BacktoTop/BacktoTop";

import locationIcon from '../../assets/icons/location.png';
import phoneIcon from '../../assets/icons/phone.png';
import Map from '../../components/Map/Map';

const Location = () => {
    // Tạo ref cho phần bản đồ
    const mapRef = useRef(null);

    // Hàm cuộn xuống phần bản đồ
    const scrollToMap = () => {
        if (mapRef.current) {
            mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div>
            <Navbar />
            <Banner
                image="src/assets/images/Banner_ViTri.jpg"
                title="Vị Trí"
            />

            <div className="body-location">
                <div className="other-branches">
                    <div className="text-content-body-location">CÁC CHI NHÁNH</div>
                    <div className="branches-container">
                        <div className="branch-item" onClick={scrollToMap}> {/* Thêm onClick vào đây */}
                            <img src={Branch1Image} alt="CN Tân Bình" className="branch-image" />
                            <div className="branch-info">
                                <h3>CN Tân Bình</h3>
                                <div className="contact-info">
                                    <p>
                                        <img src={locationIcon} alt="Location Icon" className="icon" />
                                        32 Trường Sơn, Phường 2, Quận Tân Bình, Thành phố Hồ Chí Minh, Việt Nam.
                                    </p>
                                    <p>
                                        <img src={phoneIcon} alt="Phone Icon" className="icon" />
                                        +84 906 483 257
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="branch-item" onClick={scrollToMap}> {/* Thêm onClick vào đây */}
                            <img src={Branch2Image} alt="CN Quận 10" className="branch-image" />
                            <div className="branch-info">
                                <h3>CN Quận 10</h3>
                                <div className="contact-info">
                                    <p>
                                        <img src={locationIcon} alt="Location Icon" className="icon" />
                                        828 Sư Vạn Hạnh, Phường 13, Quận 10, Thành phố Hồ Chí Minh, Việt Nam.
                                    </p>
                                    <p>
                                        <img src={phoneIcon} alt="Phone Icon" className="icon" />
                                        +84  909 805 417
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="branch-item" onClick={scrollToMap}> {/* Thêm onClick vào đây */}
                            <img src={Branch3Image} alt="CN Hóc Môn" className="branch-image" />
                            <div className="branch-info">
                                <h3>CN Hóc Môn</h3>
                                <div className="contact-info">
                                    <p>
                                        <img src={locationIcon} alt="Location Icon" className="icon" />
                                        806 QL22, ấp Mỹ Hoà 3, Quận Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam.
                                    </p>
                                    <p>
                                        <img src={phoneIcon} alt="Phone Icon" className="icon" />
                                        +84  373 408 741
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="divider" />
                    <div className="map-section" ref={mapRef}> {/* Gán ref cho phần bản đồ */}
                        <div className="text-content-body-location">VỊ TRÍ KHÁCH SẠN</div>
                        <Map />
                    </div>
                </div>
            </div>
            <BacktoTop />
            <Footer />
        </div>
    );
}

export default Location;
