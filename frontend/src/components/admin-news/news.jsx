import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ChevronRight, Edit, Trash2, Plus, LogOut, ChevronDown } from "lucide-react";
import "../admin-news/news.css";

const News = () => {
  const [notices, setNotices] = useState([
    { id: 1, text: "Major tech company announces record-breaking quarterly earnings, stock surges 15%." },
    { id: 2, text: "Global markets react to unexpected interest rate decision by central banks." },
    { id: 3, text: "Emerging market currencies show strong recovery against the US dollar." },
  ]);

  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarActive(!isSidebarActive);

  const toggleDropdown = () => setIsDropdownActive(!isDropdownActive);

  const handleLogout = () => {
    // localStorage.removeItem("userId");
    // localStorage.removeItem("role");
    navigate("/");
  };

  const handleEditNotice = (id) => {
    const updatedText = prompt("Edit notice:", notices.find((n) => n.id === id)?.text);
    if (updatedText) {
      setNotices(notices.map((n) => (n.id === id ? { ...n, text: updatedText } : n)));
    }
  };

  const handleDeleteNotice = (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      setNotices(notices.filter((n) => n.id !== id));
    }
  };

  const handleAddNotice = () => {
    const newNoticeText = prompt("Enter new notice:");
    if (newNoticeText) {
      const newNotice = { id: Date.now(), text: newNoticeText };
      setNotices([newNotice, ...notices]);
    }
  };

  return (
    <div className="dashboard-admin">
      <button id="menuToggle" className="menu-toggle" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      <aside className={`sidebar ${isSidebarActive ? "active" : ""}`}>
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
                <img src={item.icon} alt={`${item.name} icon`} className="nav-item-icon"/>
                <span>{item.name}</span>
            </div>
            <span className="chevron-side">›</span>
        </Link>
    ))}
</nav>
        <div className="admin-profiledb" onClick={toggleDropdown}>
          <img src="/img/loka.jpg" alt="Admin" className="admin-avatardb" />
          <div className="admin-infodb">
            <span className="admin-namedb">Admin Name</span>
            <span className="admin-roledb">Account Head</span>
          </div>
          <ChevronDown
            size={16}
            className={`dropdown-arrow ${isDropdownActive ? "rotate" : ""}`}
          />
         <div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </aside>
      <main className="contentdb">
        <div className="board-container">
          <div className="header-container">
            <h1 className="welcome-message">Hello Admin 👋,</h1>
          </div>
          <div className="notice-board-container">
            <h2 className="notice-title">Notice Board</h2>
            <p className="notice-subtitle">Recent News on Stock Market</p>
            <div className="notice-list-container">
              {notices.map((notice) => (
                <div key={notice.id} className="notice-item-container">
                  <span className="notice-text-content">{notice.text}</span>
                  <div className="action-buttons-container">
                    <button className="action-btn edit-btn" onClick={() => handleEditNotice(notice.id)}>
                      <Edit size={16} /> Edit
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDeleteNotice(notice.id)}>
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default News;
