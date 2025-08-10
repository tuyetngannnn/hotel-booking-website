// eslint-disable-next-line no-unused-vars
import React from "react";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import "./Brand.css"; // Import file CSS chính
import Brand1 from "../../assets/images/brand-1.jpg";
import Brand2 from "../../assets/images/brand-2.jpg";
// import Branch3Image from "../../assets/images/CN_HM_1.jpg";
import CoreValueImage1 from "../../assets/images/brand-7.jpg";
import CoreValueImage2 from "../../assets/images/brand-5.jpg";
import CoreValueImage3 from "../../assets/images/brand-4.jpg";
import CoreValueImage4 from "../../assets/images/brand-3.jpg";
import CoreValueImage5 from "../../assets/images/brand-6.jpg";
import Banner from "../../components/Banner/Banner";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import BacktoTop from "../../components/BacktoTop/BacktoTop";
import { useTranslation } from "react-i18next";


const Brand = () => {
  const { t } = useTranslation();


  return (
    <div>
      <Navbar />
      <Banner
        image="src/assets/images/Banner-brand.jpg"
        title={t("brand_tittle")}
      />
      <div className="body-th">
        <div className="brand-intro">
          <h2>{t("brand-intro")}</h2>
          <p>{t("brand-content")}</p>
        </div>
      </div>
      <div className="img-brand-1">
        <img
          src={Brand1}
          alt="Brand-1"
          style={{
            height: "370px",
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>
      <div className="body-th">
        <div className="brand-history">
          <div className="history">
            {/* <div className="horizontal-line-th left-line"></div> */}
            <h2>{t("our_story")}</h2>
            <div className="right-line"></div>
          </div>
          <div className="history-timeline">
            <div className="timeline-item">
              <h3>2019 - 2020</h3>
              <p>{t("2019-2020")}</p>
            </div>
            <div className="timeline-item">
              <h3>2020 - 2022</h3>
              <p>{t("2020-2022")}</p>
            </div>
            <div className="timeline-item">
              <h3>{t("2022_present")}</h3>
              <p>{t("2022 to present")}</p>
            </div>
          </div>
          <div className="history-1">
            <div className="left-line"></div>
          </div>
        </div>


        <div className="brand-mission">
          <div className="text-section">
            <h2>{t("our_mission")}</h2>
            <p>{t("brand-mission")}</p>
          </div>
          <div className="image-section">
            <img
              src={Brand2}
              alt="Resort pool"
              style={{
                height: "370px",
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        </div>


        <hr className="divider-1" />


        <div className="core-values-section">
          <div className="brand-history">
            <h2>{t("core-values")}</h2>
          </div>


          <div className="core-values-grid">
            {/* Cột 1: Hình ảnh lớn */}
            <div className="core-value-item column-1">
              <img src={CoreValueImage1} alt="Chất Lượng" />
              <div className="overlay-text-th">{t("quality")}</div>
            </div>


            <div className="core-value-item column-2-top">
              <img src={CoreValueImage2} alt="Sáng Tạo" />
              <div className="overlay-text-th">{t("creative")}</div>
            </div>
            <div className="core-value-item column-2-bottom">
              <img src={CoreValueImage3} alt="Trách Nhiệm" />
              <div className="overlay-text-th">{t("responsibility")}</div>
            </div>


            <div className="core-value-item column-2-top">
              <img src={CoreValueImage4} alt="Bền Vững" />
              <div className="overlay-text-th">{t("sustainable")}</div>
            </div>
            <div className="core-value-item column-2-bottom">
              <img src={CoreValueImage5} alt="Chuyên Nghiệp" />
              <div className="overlay-text-th">{t("Professional")}</div>
            </div>
          </div>
        </div>
      </div>
      <BacktoTop />
      <Footer />
    </div>
  );
};
export default Brand;





