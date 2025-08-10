// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react"; // Thêm useEffect vào import
import "../Home/Home.css";
import video from "../../assets/vid1.webm";
import vid2 from "../../assets/vid2.mp4";
import vid3 from "../../assets/vid3.mp4";
import vid4 from "../../assets/vid4.mp4";
import img10 from "../../assets/img10.png";
import img11 from "../../assets/img11.png";
import "slick-carousel/slick/slick.css";
import "react-datepicker/dist/react-datepicker.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "../../components/Slider/Slider";
import Slider2 from "../../components/Slider/Slider2";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import BacktoTop from "../../components/BacktoTop/BacktoTop";
import SearchBar from "../../components/Search/SearchBar";
import SearchCard from "../../components/Search/SearchCard";
import { SearchProvider } from "../../components/Search/SearchContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


const Home = () => {
  const { t, i18n } = useTranslation();
  const [currentImage, setCurrentImage] = useState(img10);
  const [isSearchExecuted, setIsSearchExecuted] = useState(false);


  const handleSearchExecution = (executed) => {
    console.log("Search executed:", executed);
    setIsSearchExecuted(executed);
  };
  const updateImageBasedOnLanguage = () => {
    if (i18n.language === "en") {
      setCurrentImage(img11);
    } else {
      setCurrentImage(img10);
    }
  };
  useEffect(() => {
    console.log("isSearchExecuted changed to:", isSearchExecuted);
  }, [isSearchExecuted]);


  useEffect(() => {
    updateImageBasedOnLanguage();
  }, [i18n.language]);


  return (
    <section className="home">
      <Navbar />
      <div>
        <div className="videobanner">
          <video
            src={video}
            muted
            autoPlay
            loop
            type="video/webm"
            className="background-video"
          ></video>
        </div>


        <SearchProvider>
          <SearchBar onSearch={handleSearchExecution} />
          {isSearchExecuted && <SearchCard />}
        </SearchProvider>


        {!isSearchExecuted && (
          <>
            <div className="content-section">
              <div className="left-text">
                <h1 className="main-title">{t("main-title")}</h1>
                <p className="sub-title">{t("sub-title")}</p>
              </div>
              <div className="right-text">
                <p>{t("right-text")}</p>
                <a href="#" className="booking-link">
                  {t("booking-home")}
                </a>
              </div>
            </div>


            <div className="chambienchambinhyen">
              <img src={currentImage} alt="img10" />
            </div>


            <div className="top-text">
              <h1 className="main"> {t("main")}</h1>
              <p className="sub">{t("sub")}</p>
            </div>
            <div className="discover">
              <div className="discoverLeft">
                <h1 className="mainL1">{t("mainL1")}</h1>
                <p className="contentL1">{t("contentL1")}</p>
                <Link to="/roomlist" className="viewmore-link">
                  {t("viewmore")}
                </Link>
              </div>
              <div className="discoverRight">
                <div className="slides">
                  <Slider />
                </div>
              </div>
            </div>


            <div className="taste">
              <div className="tasteLeft">
                <div className="vid2">
                  <video muted autoPlay loop type="video/mp4" src={vid2} />
                </div>
              </div>
              <div className="tasteRight">
                <h1 className="mainR1">{t("mainR1")}</h1>
                <p className="contentR1">{t("contentR1")}</p>
                <Link to="/promotion" className="viewmore-link">
                  {t("viewmore")}
                </Link>
              </div>
            </div>


            <div className="discover">
              <div className="discoverLeft">
                <h1 className="mainL1">{t("RelaxationoftheSoul")}</h1>
                <p className="contentL1">{t("enjoy")}</p>
                <Link to="/service" className="viewmore-link">
                  {t("viewmore")}
                </Link>
              </div>
              <div className="discoverRight">
                <div className="slider-container">
                  <Slider2 />
                </div>
              </div>
            </div>


            <div className="videobanner">
              <video
                muted
                autoPlay
                loop
                type="video/mp4"
                className="background-video"
                src={vid3}
              ></video>
              <div className="overlayVideo">
                <h1 className="overlay-text">{t("overlay-text")}</h1>
              </div>
            </div>


            <div className="taste">
              <div className="tasteLeft">
                <div className="vid2">
                  <video muted autoPlay loop type="video/mp4" src={vid4} />
                </div>
              </div>
              <div className="tasteRight">
                <h1 className="mainR1">{t("ourStory")}</h1>
                <p className="contentR1">{t("weAre")}</p>
                <Link to="/contactus" className="viewmore-link">
                  {t("viewmore")}
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
      <BacktoTop />
      <Footer />
    </section>
  );
};


export default Home;





