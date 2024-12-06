import React from 'react';

const NoticeboardUser = () => {
  return (
    <div className="notice-board">
      <header className="notice-board__header">
        <h1 className="notice-board__title">Notice Board</h1>
        <p className="notice-board__subtitle">Recent News on Stock Market</p>
      </header>
      <div className="notice-board__content">
        <div className="notice-board__list">
          <div className="notice-item">
            <p className="notice-item__text">Stock market reaches new highs as tech sector surges.</p>
          </div>
          <div className="notice-item">
            <p className="notice-item__text">Federal Reserve announces plans to maintain current interest rates.</p>
          </div>
          <div className="notice-item">
            <p className="notice-item__text">Oil prices fluctuate amid geopolitical tensions.</p>
          </div>
          <div className="notice-item">
            <p className="notice-item__text">Cryptocurrency market experiences volatility following regulatory news.</p>
          </div>
          <div className="notice-item">
            <p className="notice-item__text">Major merger announced in the telecommunications industry.</p>
          </div>
          <div className="notice-item">
            <p className="notice-item__text">Retail sales data exceeds expectations, boosting consumer goods stocks.</p>
          </div>
        </div>
        <div className="notice-board__nav">
          <div className="nav-dot active"></div>
          <div className="nav-dot"></div>
          <div className="nav-dot"></div>
          <div className="nav-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default NoticeboardUser;