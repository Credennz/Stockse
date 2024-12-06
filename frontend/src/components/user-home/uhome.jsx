import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Menu, ChevronDown, Calendar, Search, X } from "lucide-react";
import { Line } from "react-chartjs-2";
import "../user-home/uhome.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function UserDashboard() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState("14 Feb 2019");
  const [searchTerm, setSearchTerm] = useState("");
  const [popupMenuVisible, setPopupMenuVisible] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [news, setNews] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/new');
        console.log('Fetched news from API (limit):', response.data);

        if (response.data && response.data.length > 0) {
          setNews(response.data); // Update state with the fetched data
        } else {
          console.log('No data received from the API');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);
  
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role");

    if (!userId || userRole !== "user") {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/user-dashboard/${userId}`
        );
        setDashboardData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch dashboard data"
        );
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    // localStorage.removeItem("userId");
    // localStorage.removeItem("role");
    navigate("/");
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(
      newDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredPaymentData =
    dashboardData?.monthlyPayouts.filter((payment) =>
      payment.payout_month.toLowerCase().includes(searchTerm)
    ) || [];

  return (
    <div className="ud-dashboard">
      <button
        id="ud-menuToggle"
        className="ud-menu-toggle"
        onClick={toggleSidebar}
      >
        {sidebarActive ? <X /> : <Menu />}
      </button>
      <aside className={`ud-sidebar ${sidebarActive ? "ud-active" : ""}`}>
        <div className="ud-sidebar-header">
          <div className="ud-logo">
            <img
              src="/img/dashlogo.jpg"
              alt="Dashboard logo"
              className="ud-logodb"
            />
            <h1 className="ud-dashboard-title">StockSe</h1>
            <span className="ud-version">v.01</span>
          </div>
        </div>
        <nav className="ud-nav">
          <a href="#" className="ud-nav-item">
            <div className="ud-nav-item-content">
              <img
                src="/img/icon-dashboard.png"
                alt="Dashboard icon"
                className="ud-nav-item-icon"
              />
              <span>Dashboard</span>
            </div>
            <span className="ud-chevron">›</span>
          </a>
          <a href="/userNews" className="ud-nav-item">
            <div className="ud-nav-item-content">
              <img
                src="/img/icon-add-news.png"
                alt="Add User icon"
                className="ud-nav-item-icon"
              />
              <Link to="/UserNews">News Update</Link>
            </div>
            <span className="ud-chevron">›</span>
          </a>
        </nav>
        <div className="ud-up-card">
          <div className="ud-poc-section">
            <div className="ud-poc-title">Your POC (Point of Contact)</div>
            <div className="ud-poc-card">
              <div className="ud-poc-info">
                <div className="ud-poc-avatar">
                  <img src="/img/circle.png" alt="poc image" />
                </div>
                <div className="ud-poc-details">
                  <div className="ud-poc-name">John Maverick</div>
                  <div className="ud-poc-position">Accounts Head</div>
                </div>
              </div>
              <button
                className="ud-contact-button"
                onClick={() =>
                  window.open("https://wa.me/+918895244936", "_blank")
                }
              >
                Contact POC
              </button>
            </div>
          </div>
          <div
            className="ud-admin-profile"
            id="ud-userName"
            onClick={() => setPopupMenuVisible(!popupMenuVisible)}
          >
            <img src="/img/loka.jpg" alt="Admin" className="ud-admin-avatar" />
            <div className="ud-admin-info">
              <span className="ud-admin-name">
                {dashboardData?.userInfo?.name}
              </span>
              <span className="ud-admin-role">User</span>
            </div>
            <ChevronDown
              className={`ud-chevron-db ${popupMenuVisible ? "ud-rotate" : ""}`}
            />
          </div>

          <div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </aside>
      <main className="ud-content">
        <div className="ud-sbody">
          <div className="ud-header">
            <div className="ud-data-can">
              <h1>Hello {dashboardData?.userInfo?.name} 👋,</h1>
            </div>
            <div className="ud-date-container">
              <Calendar className="ud-calendar-icon" />
              <div className="ud-date-content">
                <span className="ud-date-label">Invested Month</span>
                <span className="ud-selected-date">
                  {dashboardData?.userInfo?.investmentDate
                    ? new Date(
                        dashboardData.userInfo.investmentDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
          <div className="ud-stats-container">
            <div className="ud-stat-item">
              <div className="ud-stat-icon ud-green-bg">
                <img class="cc" src="/img/money-recive.png" alt="" />
              </div>
              <div className="ud-stat-info">
                <h3>Total Invested</h3>
                <p>${dashboardData?.userInfo?.investedAmount}</p>
              </div>
              <div className="ud-vl"></div>
            </div>
            <div className="ud-stat-item">
              <div className="ud-stat-icon ud-blue-bg">
                <img class="cc" src="/img/payout.png" alt="" />
              </div>
              <div className="ud-stat-info">
                <h3>${dashboardData?.totalPayout || "0.00"}</h3>
                <p>Last Month's Total Payout</p>
              </div>
              <div className="ud-vl"></div>
            </div>
            <div className="ud-stat-item">
              <div className="ud-stat-icon ud-pink-bg">
                <img class="cc" src="/img/users.png" alt="" />
              </div>
              <div className="ud-stat-info">
                <h3>{dashboardData?.roiTillDate || "0.00"}%</h3>
                <p>ROI Till Date</p>
              </div>
            </div>
          </div>
          <div className="ud-cab-a">
            <div className="ud-mpcontainer">
              <div className="ud-chart-container">
                <img
                  src="../img/user3.png"
                  alt="Earning Preview"
                  className="ud-chart-image"
                />
              </div>
            </div>
            <div className="ud-notice-board">
              <header className="ud-notice-board__header">
                <h1 className="ud-notice-board__title">Notice Board</h1>
                <p className="ud-notice-board__subtitle">
                  Recent News on Stock Market
                </p>
              </header>
              <div className="ud-scroll-container">
              <div id="ud-newsContainer">
    {news && news.length > 0 ? (
      news.map((item, idx) => (
        <div key={item.id || idx} className="ud-news-card">
          <div className="ud-news-title">{item.title}</div>
        </div>
      ))
    ) : (
      <p>No news available.</p>
    )}
  </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ud-sun-container">
          <div className="ud-sun-header">
            <h1 className="ud-sun-title">Payment Details</h1>
          </div>
          <div className="ud-sun-search-container">
            <div className="ud-sun-search-box">
              <Search className="ud-sun-search-icon" />
              <input
                type="text"
                id="ud-sun-searchInput"
                className="ud-sun-search-input"
                placeholder="Search By (Month year)"
                onChange={handleSearch}
              />
            </div>
            <div className="ud-sun-current-date" id="ud-sun-currentDate">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
          <div className="ud-sun-bro">
            <table id="ud-sun-paymentTable">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Payout Amount</th>
                  <th>Total Payout</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody id="ud-sun-paymentTableBody">
                {filteredPaymentData
                  .sort(
                    (a, b) =>
                      new Date(b.payout_month) - new Date(a.payout_month)
                  ) // Sort by latest month first
                  .map((payout, index) => {
                    // Calculate cumulative total payout starting from November
                    const cumulativeTotalPayout = filteredPaymentData
                      .filter((p) => {
                        const currentMonth = new Date(
                          payout.payout_month
                        ).getMonth();
                        const pMonth = new Date(p.payout_month).getMonth();
                        return (
                          (currentMonth >= 10 &&
                            pMonth >= 10 &&
                            pMonth <= currentMonth) ||
                          (currentMonth < 10 &&
                            (pMonth >= 10 || pMonth <= currentMonth))
                        );
                      })
                      .reduce(
                        (sum, p) =>
                          sum + parseFloat(p.payout_amount.replace(/,/g, "")),
                        0
                      );

                    return (
                      <tr key={payout.id}>
                        <td className="ud-sun-month-cell">
                          {payout.payout_month}
                        </td>
                        <td>${payout.payout_amount}</td>
                        <td className="ud-sun-total-payout-cell">
                          $
                          {cumulativeTotalPayout.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td>
                          <span
                            className={`ud-sun-status ${
                              payout.payment_status === "Received"
                                ? "ud-sun-status-received"
                                : "ud-sun-status-done"
                            }`}
                          >
                            {payout.payment_status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
