import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronDown, Search } from 'lucide-react';
import './home.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeNoticeIndex, setActiveNoticeIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [investmentStats, setInvestmentStats] = useState({
    totalUsers: 0,
    totalInvestment: 0,
    totalPayout: 0,
  });
  const [news, setNews] = useState([]);

  // logout 
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage.removeItem("userId");
    // localStorage.removeItem("role");
    navigate("/");
  };

    //logout end


    // payout 
    useEffect(() => {
      fetchTotalPayout(); // Fetch total payout data on component load
    }, []);

    const fetchTotalPayout = async () => {
      try {
        // Fetch data from the payouts table
        const response = await axios.get("http://localhost:5001/api/payoutsdata");
        const payouts = response.data; // Ensure this returns an array
        console.log("Payouts data:", payouts); // Log to verify structure

        // Calculate the total payout amount
        const totalPayout = payouts.reduce(
          (acc, payout) => acc + (Number(payout.payout_amount) || 0),
          0
        );

        // Update only the totalPayout in the investmentStats state
        setInvestmentStats((prevStats) => ({
          ...prevStats, // Preserve existing totalUsers and totalInvestment
          totalPayout,  // Update only totalPayout
        }));


        console.log("Total Payout Calculated:", totalPayout); // Optional log
      } catch (error) {
        console.error("Error fetching payout data:", error);
      }
    };

    
    //payout end

    useEffect(() => {
      fetchUserData();
      setCurrentDate(formatDate(new Date()));
    }, []);

    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users"); // Backend API
        const users = response.data;
        console.log(users); // Log to verify the structure and values


        // Calculate totals
        const totalUsers = users.length;
        const totalInvestment = users.reduce(
          (acc, user) => acc + (user.investedAmount || 0),
          0
        );


        setUserData(users);
        setFilteredUsers(users);
        setInvestmentStats({ totalUsers, totalInvestment });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    useEffect(() => {
      if (userData.length > 0) {
        const totalUsers = userData.length;

        const totalInvestment = userData.reduce(
          (acc, user) => acc + (Number(user.investedAmount) || 0),
          0
        );



        // Ensure that totalInvestment and totalPayout are valid numbers
        setInvestmentStats({
          totalUsers,
          totalInvestment: totalInvestment || 0
        });
      }
    }, [userData]);

    // nn
    const [payoutData, setPayoutData] = useState([]);

    useEffect(() => {
      fetchUserData();
      fetchPayoutData();
    }, []);
    const fetchPayoutData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/payoutdata");
        setPayoutData(response.data);
      } catch (error) {
        console.error("Error fetching payout data:", error);
      }
    };

    const combinedData = userData.map(user => {
      const payout = payoutData.find(p => p.user_id === user.id); // Match user with payout by user_id
      return {
        ...user,
        paymentStatus: payout ? payout.payment_status : "Pending" // Add paymentStatus from payout data
      };
    });

    const notices = [
      "Stock market reaches new highs as tech sector surges.",
      "Federal Reserve announces plans to maintain current interest rates.",
      "Oil prices fluctuate amid geopolitical tensions.",
      "Cryptocurrency market experiences volatility following regulatory news.",
      "Major merger announced in the telecommunications industry.",
      "Retail sales data exceeds expectations, boosting consumer goods stocks."
    ];

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
    const monthlyData = [
      { month: 'Jan', percentage: 45 },
      { month: 'Feb', percentage: 55 },
      { month: 'Mar', percentage: 65 },
      { month: 'Apr', percentage: 35 },
      { month: 'May', percentage: 30 },
      { month: 'Jun', percentage: 40 },
      { month: 'Jul', percentage: 45 },
      { month: 'Aug', percentage: 50, tooltipImg: '/img/Group 12.png' },
      { month: 'Sep', percentage: 50 },
      { month: 'Oct', percentage: 35 },
      { month: 'Nov', percentage: 45 },
      { month: 'Dec', percentage: 40 }
    ];

    useEffect(() => {
      setFilteredUsers(userData);
      setCurrentDate(formatDate(new Date()));

      const handleResize = () => {
        if (window.innerWidth > 768) setIsSidebarActive(false);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
      setIsSidebarActive(!isSidebarActive);
    };
    const toggleProfileMenu = () => {
      setProfileMenuOpen(!profileMenuOpen);
    };


    const handleSearch = (e) => {
      const term = e.target.value.toLowerCase();
      setSearchTerm(term);
      const filtered = userData.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.address?.toLowerCase().includes(term) ||
          user.referredBy?.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    };

    const handleDotClick = (index) => {
      setActiveNoticeIndex(index);
    };

    const formatDate = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };
    

    return (
      <div className="dashboard-admin">
        <button id="menuToggle" className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={30} />
        </button>
        <aside className={`sidebar ${isSidebarActive ? 'active' : ''}`}>
          <div className="sidebar-header">
            <div className="logodb">
              <img src="/img/dashlogo.jpg" alt="Dashboard logo" className="logodb" />
              <h1 className="dashboard-title">Dashboard</h1>
              <span className="versionD">v.01</span>
            </div>
          </div>
          <nav>
            {[
              { name: 'Dashboard', icon: '/img/icon-dashboard.png', link: '/adminhome' },
              { name: 'Add User', icon: '/img/icon-add-user.png', link: '/adduser' },
              { name: 'View User List', icon: '/img/icon-user-list.png', link: '/userlist' },
              { name: 'News Update', icon: '/img/icon-add-news.png', link: '/newsupdate' },
              { name: 'Add News', icon: '/img/icon-add-news.png', link: '/news' },
              { name: 'Payment user list', icon: '/img/icon-add-news.png', link: '/muserlist' }
            ].map((item, index) => (
              <Link key={item.name} to={item.link} className={`nav-itemdb ${item.active ? 'active' : ''}`}>
                <div className="nav-item-contentdb">
                  <img src={item.icon} alt={`${item.name} icon`} className="nav-item-icon" />
                  <span>{item.name}</span>
                </div>
                <span className="chevron-side">›</span>
              </Link>
            ))}
          </nav>

          <div className="admin-profiledb" onClick={toggleProfileMenu}>
            <img src="/img/loka.jpg" alt="Admin" className="admin-avatardb" />
            <div className="admin-infodb">
              <span className="admin-namedb">Admin Name</span>
              <span className="admin-roledb">Account Head</span>
            </div>
            <ChevronDown className={`chevron-db ${profileMenuOpen ? 'rotate-180' : ''}`} />
          </div>
          <div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </aside>
        <main className="contentdb">
          <div className="dbadmin">
            <div className="dbhello">
              <img className="ad1" src="/img/hello-admin.png" alt="Hello Admin" />
            </div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search user"
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="search-icon" aria-hidden="true" />
            </div>
          </div>
          <div className="dbinvestment">
            <div className="dbinvestment-scroll">
              {/* Total Investment */}
              <div className="stat">
                <div className="micon">
                  <img className="bgimg" src="/img/Ellipse 3.png" alt="bg" />
                  <img className="bgl" src="/img/money-recive.png" alt="Total Investment Icon" />
                </div>
                <div className="text">
                  <span className="label">Total Investment</span>
                  <span className="value">
                    ${Number(investmentStats.totalInvestment).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Total Payout */}
              <div className="stat">
                <div className="micon">
                  <img className="bgimg" src="/img/Ellipse 3.png" alt="bg" />
                  <img className="bgl" src="/img/payout.png" alt="Total Payout Icon" />
                </div>
                <div className="text">
                  <span className="label">Total Payout</span>
                  <span className="value">
                    ${investmentStats.totalPayout !== undefined && investmentStats.totalPayout !== null
                      ? investmentStats.totalPayout.toLocaleString()
                      : 0}
                  </span>
                </div>
              </div>

              {/* Total Users */}
              <div className="stat">
                <div className="micon">
                  <img className="bgimg" src="/img/Ellipse 3.png" alt="bg" />
                  <img className="bgl" src="/img/users.png" alt="Total Users Icon" />
                </div>
                <div className="text">
                  <span className="label">Total Users</span>
                  <span className="value">{investmentStats.totalUsers}</span>
                </div>
              </div>
            </div>
          </div>


          <div className="notice-dashboard">
            <section className="analytics">
              <header className="analytics__header">
                <div>
                  <h2 className="analytics__title">Overview</h2>
                  <p className="analytics__subtitle">Total Customers</p>
                </div>
                <select className="analytics__select">
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </header>
              <div className="graph">
                <div className="graph__container">
                  {monthlyData.map((data, index) => (
                    <div key={data.month} className="graph__bar-wrapper">
                      <div className={`graph__bar graph__bar--${data.month.toLowerCase()}`}>
                        <div className="graph__tooltip">
                          {data.tooltipImg ? <img src={data.tooltipImg} alt="tooltip" /> : `${data.percentage}%`}
                        </div>
                        <span className="graph__label">{data.month}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="notice-board">
              <header className="notice-board__header">
                <h1 className="notice-board__title">Notice Board</h1>
                <p className="notice-board__subtitle">Recent News on Stock Market</p>
              </header>
              <div className="notice-board__content">
                <div className="notice-board__list">
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
                <div className="notice-board__nav">
                  {notices.map((_, index) => (
                    <div
                      key={index}
                      className={`nav-dot ${index === activeNoticeIndex ? 'active' : ''}`}
                      onClick={() => handleDotClick(index)}
                    ></div>
                  ))}
                </div>
              </div>
            </section>
          </div>
          <div className="ud-container">
            <div className="ud-header">
              <h1 className="ud-title">User Details</h1>
              <div className="ud-search__wrapper">
                <input
                  type="search"
                  className="ud-search__input"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="ud-search__icon" />
              </div>
              <div className="ud-date">{currentDate}</div>
            </div>
            <table className="ud-table">
              <thead>
                <tr>
                  <th className="ud-table__header">User Name</th>
                  <th className="ud-table__header">Referred By</th>
                  <th className="ud-table__header">Invested Amt</th>
                  <th className="ud-table__header">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="ud-table__row">
                      <td className="ud-table__cell">
                        <div className="ud-user">
                          <div className="ud-user__avatar"></div>
                          <div className="ud-user__info">
                            <span className="ud-user__name">{user.name}</span>
                            <span className="ud-user__address">{user.address}</span>
                          </div>
                        </div>
                      </td>
                      <td className="ud-table__cell">{user.referredBy || "N/A"}</td>
                      <td className="ud-table__cell">${user.investedAmount}</td>
                      <td
                        className={`ud-table__cell ${user.payment_status === "Done"
                            ? "ud-status--done"
                            : "ud-status--pending"
                          }`}
                      >
                        {user.payment_status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="ud-table__cell" colSpan="4">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );
  }