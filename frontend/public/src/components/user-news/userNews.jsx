import React, { useEffect, useState } from 'react';
import './userNews.css';
import { Menu } from 'lucide-react';

const UserNews = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [sidebarActive, setSidebarActive] = useState(false); // State to manage sidebar active state

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
                            <span>Dashboard</span>
                        </div>
                        <span className="chevron">›</span>
                    </a>
                    <a href="#" className="nav-item">
                        <div className="nav-item-content">
                            <img src="/img/icon-add-news.png" alt="Add User icon" className="nav-item-icon" />
                            <span>News Update</span>
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
            </aside>
            <main className="content">
                <div className="user-container">
                    <div className="user-head">
                        <h4>Hello User Name 👋🏼</h4>
                        <div className="udate">
                            <span className="udate-icon">📅</span>
                            <span className="udate-label">Invested Month</span>
                            <span className="udate-value" id="currentDate">{currentDate}</span>
                        </div>
                    </div>
                    <section className="intro-section">
                        <button className="arrow-button">
                            <span className="arrow-icon">‹</span>
                        </button>
                        <div className="intro-text">
                            <p><h5><b>Es un hecho establecido hace demasiado tiempo que un lector se distraerá con el contenido del texto de un sitio mientras que mira su diseño</b></h5></p>
                        </div>
                    </section>
                    <section className="user-content">
                        <h4>H1 Heading</h4>
                        <p><b>Lorem ipsum dolor sit amet. Sed internos magnam qui voluptatibus atque et rerum fugit eum error nihil ad unde quidem eos eveniet nobis aut ipsa labore. Qui dolorem voluptatem id dolor quae eum earum enim aut velit doloribus et quis natus.</b></p>
                        <p><b>Sed harum dolorum quo corporis voluptate et ipsa quia et eius porro a cupiditate sunt non tenetur incidunt ut consectetur iste. A aperiam blanditiis est reprehenderit sunt est tempore consectetur! Cum incidunt vero id eveniet dolor eos pariatur nihil nam error consequuntur rem cumque corrupti qui rerum deserunt.</b></p>
                        <p><b>Et dolor nisi qui tempore molestias ad quidem dolores. Aut quod rerum vel tempora ipsa qui neque suscipit qui cumque sunt vel natus perspiciatis qui commodi repellat et facilis saepe.</b></p><br /><br />
                        <h4>H2 Heading</h4>
                        <button className="image-button">🖼️</button>
                        <p><b>Lorem ipsum dolor sit amet. Sed internos magnam qui voluptatibus atque et rerum fugit eum error nihil ad unde quidem eos eveniet nobis aut ipsa labore. Qui dolorem voluptatem id dolor quae eum earum enim aut velit doloribus et quis natus.</b></p>
                        <p><b>Sed harum dolorum quo corporis voluptate et ipsa quia et eius porro a cupiditate sunt non tenetur incidunt ut consectetur iste. A aperiam blanditiis est reprehenderit sunt est tempore consectetur! Cum incidunt vero id eveniet dolor eos pariatur nihil nam error consequuntur rem cumque corrupti qui rerum deserunt.</b></p>
                        <p><b>Et dolor nisi qui tempore molestias ad quidem dolores. Aut quod rerum vel tempora ipsa qui neque suscipit qui cumque sunt vel natus perspiciatis qui commodi repellat et facilis saepe.</b></p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default UserNews;
