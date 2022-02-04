import React, { useEffect } from "react";
import { Communications } from "../../helpers";
import "./DashboardScreen.scss";
import Lottie from "react-lottie";
import animationData from "../../assets/animations/ComingSoon.json";

const DashboardScreen = () => {
  const defaultOptions = {
    animationData,
  };

  useEffect(() => {
    Communications.pageTitleSubject.next("Dashboard");
    Communications.pageBackButtonSubject.next(null);
  }, []);

  return (
    <div className="dashboard screen crud-layout">
      <Lottie height={500} speed={1} options={defaultOptions} />
    </div>
  );
};

export default DashboardScreen;
