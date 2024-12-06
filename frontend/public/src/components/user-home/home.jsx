import React, { useState, useEffect } from 'react';
import { Menu, ChevronDown, Calendar, Search } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './home.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Sidebar = ({ isActive, toggleSidebar }) => (
  <aside className={`sidebar ${isActive ? 'active' : ''}`}>
    <div className="sidebar-header">
      <div className="logo">
        <img src="/img/dashlogo.jpg" alt="Dashboard logo" className="logodb" />
        <h1 className="dashboard-title">StockSe</h1>
        <span className="version">v.01</span>
      </div>
    </div>
    <nav>
      <a href="#" className="nav-item">
        <div className="nav-item-content">
          <img src="/img/icon-dashboard.png" alt="Dashboard icon" className="nav-item-icon" />
          <span>Dashboard</span>
        </div>
        <span className="chevron">›</span>
      </a>
      <a href="#" className="nav-item">
        <div className="nav-item-content">
          <img src="/img/icon-add-news.png" alt="News Update icon" className="nav-item-icon" />
          <span>News Update</span>
        </div>
        <span className="chevron">›</span>
      </a>
    </nav>
    <div className="up-card">
      <div className="UP-poc-section">
        <div className="UP-poc-title">Your POC (Point of Contact)</div>
        <div className="UP-poc-card">
          <div className="UP-poc-info">
            <div className="UP-poc-avatar">
              <img src="/img/circle.png" alt="POC avatar" />
            </div>
            <div className="UP-poc-details">
              <div className="UP-poc-name">John Maverick</div>
              <div className="UP-poc-position">Accounts Head</div>
            </div>
          </div>
          <button className="UP-contact-button">Contact POC</button>
        </div>
      </div>
      <div className="admin-profile">
        <img src="/img/loka.jpg" alt="Admin" className="admin-avatar" />
        <div className="admin-info">
          <span className="admin-name">Admin Name</span>
          <span className="admin-role">Account Head</span>
        </div>
        <ChevronDown className="chevron-db" />
      </div>
    </div>
  </aside>
);

const StatItem = ({ icon, value, label, className }) => (
  <div className="stat-item">
    <div className={`stat-icon ${className}`}>
      {icon}
    </div>
    <div className="stat-info">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
    <div className="vl"></div>
  </div>
);

const EarningChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Reinvested",
        data: [30, 25, 20, 35, 45, 35, 85, 45, 65, 35, 55, 20],
        fill: true,
        backgroundColor: "rgba(255, 159, 139, 0.7)",
        borderColor: "rgba(255, 159, 139, 1)",
        tension: 0.4,
      },
      {
        label: "Withdrawn/Month",
        data: [65, 35, 30, 40, 35, 45, 55, 40, 35, 45, 85, 35],
        fill: true,
        backgroundColor: "rgba(187, 159, 255, 0.7)",
        borderColor: "rgba(187, 159, 255, 1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
        grid: {
          color: "#f0f0f0",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

const NoticeBoard = () => {
  const notices = [
    "Stock market reaches new highs as tech sector surges.",
    "Federal Reserve announces plans to maintain current interest rates.",
    "Oil prices fluctuate amid geopolitical tensions.",
    "Cryptocurrency market experiences volatility following regulatory news.",
    "Major merger announced in the telecommunications industry.",
    "Retail sales data exceeds expectations, boosting consumer goods stocks.",
  ];

  return (
    <div className="notice-board">
      <header className="notice-board__header">
        <h1 className="notice-board__title">Notice Board</h1>
        <p className="notice-board__subtitle">Recent News on Stock Market</p>
      </header>
      <div className="notice-board__content">
        <div className="notice-board__list">
          {notices.map((notice, index) => (
            <div key={index} className="notice-item">
              <p className="notice-item__text">{notice}</p>
            </div>
          ))}
        </div>
        <div className="notice-board__nav">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`nav-dot ${i === 0 ? 'active' : ''}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PaymentTable = ({ paymentData, searchTerm }) => {
  const filteredData = paymentData.filter(payment =>
    payment.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <table id="sun-paymentTable">
      <thead>
        <tr>
          <th>Month</th>
          <th>Payout Amount</th>
          <th>Total Payout</th>
          <th>Payment Status</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((payment, index) => (
          <tr key={index}>
            <td className="sun-month-cell">{payment.month}</td>
            <td>{payment.payoutAmount}</td>
            <td className="sun-total-payout-cell">{payment.totalPayout}</td>
            <td>
              <span className={`sun-status ${payment.status === "Received" ? "sun-status-received" : "sun-status-done"}`}>
                {payment.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Dashboard = () => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState('14 Feb 2019');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const paymentData = [
    { month: "January 2024", payoutAmount: "1,00,000", totalPayout: "2,00,000", status: "Received" },
    { month: "February 2024", payoutAmount: "5,00,000", totalPayout: "510000", status: "Done" },
    { month: "March 2024", payoutAmount: "4,00,000", totalPayout: "600000", status: "Done" },
    { month: "April 2024", payoutAmount: "8,00,000", totalPayout: "844844", status: "Done" },
    { month: "May 2024", payoutAmount: "10,00,000", totalPayout: "8448441", status: "Received" },
  ];

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
  }, []);

  const toggleSidebar = () => setIsSidebarActive(!isSidebarActive);

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
  };

  return (
    <div className="dashboard">
      <button id="menuToggle" className="menu-toggle" onClick={toggleSidebar}>
        <Menu />
      </button>
      <Sidebar isActive={isSidebarActive} toggleSidebar={toggleSidebar} />
      <main className="content">
        <div className="sbody">
          <div className="header">
            <div className="data-can">
              <h1>Hello User Name 👋</h1>
            </div>
            <div className="date-container" onClick={() => document.getElementById("datePicker").showPicker()}>
              <Calendar className="calendar-icon" />
              <div className="date-content">
                <span className="date-label">Invested Month</span>
                <span className="selected-date">{selectedDate}</span>
              </div>
              <input type="date" id="datePicker" onChange={handleDateChange} style={{ display: 'none' }} />
            </div>
          </div>

          <div className="stats-container">
            <StatItem icon={<img src="../img/money-recive.png" alt="Money icon" className='stat-icon'/>} value="5,00,000" label="Total Investments" className="green-bg" />
            <StatItem icon={<img src="../img/payout.png" alt="Wallet icon" className='stat-icon' />} value="1,500" label="Total Payout/Month" className="blue-bg" />
            <StatItem icon={<img src="../img/users.png" alt="Bag icon" className='stat-icon' />} value="52%" label="ROI Till Date" className="pink-bg" />
          </div>

          <div className="cab-a">
            <div className="mpcontainer">
              <div className="mpheader">
                <div>
                  <div className="title">Earning Preview</div>
                  <div className="subtitle">Preview calculation with analytics</div>
                </div>
                <select className="dropdown">
                  <option>Till Date</option>
                  <option>Till Month</option>
                </select>
              </div>
              <div className="chart-container">
                <EarningChart />
              </div>
            </div>
            <NoticeBoard />
          </div>
        </div>

        <div className="sun-container">
          <div className="sun-header">
            <h1 className="sun-title">Payment Details</h1>
          </div>
          <div className="sun-search-container">
            <div className="sun-search-box">
              <Search className="sun-search-icon" />
              <input
                type="text"
                id="sun-searchInput"
                className="sun-search-input"
                placeholder="Search By (Month year)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sun-current-date">Current Date: {currentDate}</div>
          </div>
          <div className="sun-bro">
            <PaymentTable paymentData={paymentData} searchTerm={searchTerm} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;