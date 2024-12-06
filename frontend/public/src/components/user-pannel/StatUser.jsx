import React from 'react';

const StatUser = () => {
  return (
    <div className="stats-container">
      <div className="stat-item">
        <div className="stat-icon green-bg">
          <img src="/placeholder.svg?height=48&width=48" alt="Money icon" />
        </div>
        <div className="stat-info">
          <h3>5,00,000</h3>
          <p>Total Investments</p>
        </div>
        <div className="vl"></div>
      </div>
      <div className="stat-item">
        <div className="stat-icon blue-bg">
          <img src="/placeholder.svg?height=48&width=48" alt="Wallet icon" />
        </div>
        <div className="stat-info">
          <h3>1,500</h3>
          <p>Total Payout/Month</p>
        </div>
        <div className="vl"></div>
      </div>
      <div className="stat-item">
        <div className="stat-icon pink-bg">
          <img src="/placeholder.svg?height=48&width=48" alt="Bag icon" />
        </div>
        <div className="stat-info">
          <h3>52%</h3>
          <p>ROI Till Date</p>
        </div>
      </div>
    </div>
  );
};

export default StatUser;