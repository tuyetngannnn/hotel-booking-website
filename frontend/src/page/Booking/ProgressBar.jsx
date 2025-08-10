import React from "react";
import PropTypes from "prop-types";
import "./booking.css"; // Đảm bảo rằng bạn đã nhập CSS
const ProgressBar = ({ currentStep }) => {
  const steps = [
    { label: "Thông tin phòng", value: 1 },
    { label: "Chọn dịch vụ", value: 2 },
    { label: "Điền thông tin", value: 3 },
  ];

  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <React.Fragment key={step.value}>
          <div className="step">
            <div
              className={`circle ${currentStep >= step.value ? "active" : ""}`}
            >
              {step.value}
            </div>
            <h3>{step.label}</h3>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`progress-line ${
                currentStep > step.value ? "completed" : ""
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Định nghĩa kiểu dữ liệu cho props
ProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default ProgressBar;
