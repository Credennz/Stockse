import React, { useEffect, useState } from 'react';
import './userNews.css';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserNews = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [sidebarActive, setSidebarActive] = useState(false); // State to manage sidebar active state
    const navigate = useNavigate();
    useEffect(() => {
        // Set the current date
        const formatDate = (date) => {
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            return new Date(date).toLocaleDateString('en-GB', options);
        };

        setCurrentDate(formatDate(new Date()));

        // Close sidebar when clicking outside on mobile
        const handleClickOutside = (event) => {
            const isClickInsideSidebar = document.querySelector('.sidebar').contains(event.target);
            const isClickOnMenuToggle = document.getElementById('menuToggle').contains(event.target);

            if (!isClickInsideSidebar && !isClickOnMenuToggle && window.innerWidth <= 768) {
                setSidebarActive(false); // Close sidebar
            }
        };

        document.addEventListener('click', handleClickOutside);

        // Handle window resize
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setSidebarActive(false); // Automatically close sidebar if window is resized to desktop
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleSidebar = () => {
        setSidebarActive((prevState) => !prevState); // Toggle the sidebar state
    };
    const handleLogout = () => {
        // localStorage.removeItem("userId");
        // localStorage.removeItem("role");
        navigate("/");
    };
    const [news, setNews] = useState([]);
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/titles");
                console.log("Fetched news:", response.data); // Debugging output
                if (response.data) {
                    setNews(response.data); // Update state with fetched data
                } else {
                    console.log("No data found in response.");
                }
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };

        fetchNews();
    }, []);
   
  
    return (
        <div className="dashboard">
            <button id="menuToggle" className="menu-toggle" onClick={toggleSidebar}>
                <Menu />  {/* Using the Menu icon */}
            </button>
            <aside className={`sidebar ${sidebarActive ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <img src="/img/dashlogo.jpg" alt="Dashboard logo" className="logodb" />
                        <h1 className="dashboard-title">Stock</h1>
                        <span className="version">v.01</span>
                    </div>
                </div>
                <nav>
                <a href="#" className="nav-item">
        <div className="nav-item-content">
          <img src="/img/icon-dashboard.png" alt="Dashboard icon" className="nav-item-icon" />
          <Link to="/userHome">Dashboard</Link>
        </div>
        <span className="chevron">›</span>
      </a>
      <a href="#" className="nav-item">
        <div className="nav-item-content">
          <img src="/img/icon-add-news.png" alt="News Update icon" className="nav-item-icon" />
          <Link to="/UserNews">News Update</Link>
         
        </div>
        <span className="chevron">›</span>
      </a>
                </nav>
                <div className="UP-poc-section">
                    <div className="UP-poc-title">Your POC (Point of Contact)</div>
                    <div className="UP-poc-card">
                        <div className="UP-poc-info">
                            <div className="UP-poc-avatar"><img src="/img/circle.png" alt="poc image" /></div>
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
                    <img src="/img/chevron-down.png" alt="Expand user menu" className="chevron-db" />
                </div>
                <div>
                            <button onClick={handleLogout} className="logout-button">
                                Logout
                            </button>
                        </div>
            </aside>
            <main className="content">
            <div className="user-container">
            <div className="ud-notice-board">

                            <header className="ud-notice-board__header1">
                                <h1 className="ud-notice-board__title">Notice Board</h1>
                                <p className="ud-notice-board__subtitle">
                                    Recent News on Stock Market
                                </p>
                            </header>
                            <div className="ud-scroll-container">
                                <div id="ud-newsContainer">
                                    {news.length > 0 ? (
                                        news.map((item, idx) => (
                                            <div key={idx} className="ud-news-card">
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
                
            </main>
        </div>
    );
};

export default UserNews;
