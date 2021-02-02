import React from "react";

const Loader = () => {
  return (
    <div className="case__loading">
      <div className="big__circle">
        <div className="inner__circle"></div>
        <div className="loader">
          <svg className="circular" viewBox="25 25 50 50">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#00e8aa" />
                <stop offset="50%" stop-color="#00e857" />{" "}
                <stop offset="100%" stop-color="#00e8ad" />
              </linearGradient>
            </defs>
            <circle
              className="path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke="url(#gradient)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Loader;
