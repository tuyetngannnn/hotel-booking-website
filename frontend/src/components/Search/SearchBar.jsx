import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import arrow from "../../assets/arrow.png";
import location from "../../assets/location.png";
import number from "../../assets/number.png";
import search from "../../assets/search.png";
import calendarIcon from "../../assets/calender.png";
import { SearchContext } from "./SearchContext.jsx";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchBar = ({ onSearch }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("datPhong");
  const { searchResults, setSearchResults, setIsSearchExecuted, setSearchId } = useContext(SearchContext);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [branches, setBranches] = useState([]);

  const today = new Date();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchClick = () => {
    onSearch(true);
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("http://localhost:4000/branch/getallbranch");
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhánh:", error);
      }
    };

    fetchBranches();
  }, []);

  const searchRoom = async (event) => {
    event.preventDefault();
    if (!selectedBranch || !startDate || !endDate || guests <= 0) {
      toast.warning("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:4000/search/searchroom", {
        params: {
          branch: selectedBranch,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          guests: Number(guests),
        },
      });

      if (Array.isArray(response.data) && response.data.length === 0) {
        toast.error("Không có phòng nào khả dụng.");
        setSearchResults([]); // Reset searchResults nếu không có phòng
      } else {
        setSearchResults(response.data); // Cập nhật kết quả tìm kiếm
      }

      setIsSearchExecuted(true);
      setSearchId(Date.now());
    } catch (error) {
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
        toast.error(`Lỗi từ server: ${error.response.data}`);
      } else {
        console.error("Lỗi khi tìm kiếm phòng:", error);
        toast.error("Đã xảy ra lỗi khi tìm kiếm phòng.");
      }
    }
  };

  return (
    <div>
      <div className="App">
        <div className="tab-content">
          <div className="tab-menu">
            <button
              className={`tab-button ${activeTab === "datPhong" ? "active" : ""}`}
              onClick={() => handleTabChange("datPhong")}
            >
              {t("bookingHome")}
            </button>
            <button
              className={`tab-button ${activeTab === "nhanPhong" ? "active" : ""}`}
              onClick={() => handleTabChange("nhanPhong")}
            >
              {t("checkinHome")}
            </button>
          </div>
          {activeTab === "datPhong" && (
            <div className="tab-panel">
              <form className="form-horizontal" onSubmit={searchRoom}>
                <div className="form-group">
                  <label className="labelhomepage">{t("labelHotel")}</label>
                  <ul className="locationHome">
                    <img src={location} alt="location" style={{ width: "25px", height: "25px" }} />
                    <select
                      className="inputText"
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                      <option value="" disabled>{t("selectHotel")}</option>
                      {branches.length > 0 ? (
                        branches.map((branch) => (
                          <option key={branch._id} value={branch._id}>{branch.branchname}</option>
                        ))
                      ) : (
                        <option value="" disabled>{t("nobranches")}</option>
                      )}
                    </select>
                  </ul>
                </div>
                <div className="form-group">
                  <label className="labelhomepage">{t("dateHome")}</label>
                  <ul className="booking-date">
                    <img src={calendarIcon} alt="Calendar Icon" style={{ width: "25px", height: "25px" }} />
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      placeholderText={t("selectCheckInDate")}
                      className="inputText"
                      minDate={today}
                    />
                    <img src={arrow} alt="arrow" style={{ width: "15px", height: "15px" }} />
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      placeholderText={t("selectCheckOutDate")}
                      className="inputText"
                      minDate={startDate}
                    />
                  </ul>
                </div>
                <div className="form-group">
                  <label className="labelhomepage">{t("numberHome")}</label>
                  <ul className="numberHome">
                    <img src={number} alt="number" style={{ width: "25px", height: "25px" }} />
                    <input
                      type="number"
                      className="inputText"
                      placeholder="1"
                      min="1"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                    />
                  </ul>
                </div>
                <div className="form-btn">
                  <button
                    type="submit"
                    className="btnBookRoom"
                    onClick={handleSearchClick}
                  >
                    <img src={search} alt="search" style={{ width: "25px", height: "25px" }} />
                    {t("searching")}
                  </button>
                </div>
              </form>
            </div>
          )}
          {activeTab === "nhanPhong" && (
            <div className="tab-panel">
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="labelhomepage">{t("bookingcode")}</label>
                  <input type="text" placeholder={t("enter-booking-code")} className="inputText" />
                </div>
                <div className="form-groupPhone">
                  <label className="labelhomepage">{t("phoneNumber")}</label>
                  <input type="tel" placeholder={t("enter-phone-number")} className="inputText" />
                </div>
                <div className="form-group">
                  <label className="labelhomepage">EMAIL</label>
                  <input type="email" placeholder={t("enter-email")} className="inputText" />
                </div>
                <div className="form-btn">
                  <button type="submit" className="btnBookRoom">
                    <img src={search} alt="search" style={{ width: "25px", height: "25px" }} />
                    {t("searching")}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      {/* {searchResults.length > 0 && (
        <SearchCard />
      )} */}
      <ToastContainer/>
    </div>
  );
};

export default SearchBar;
