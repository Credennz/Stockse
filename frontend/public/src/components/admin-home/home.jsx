import React, { useState, useEffect } from 'react';
import { Menu, ChevronDown, Search } from 'lucide-react';
import './home.css';

export default function Home() {
    const [isSidebarActive, setIsSidebarActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [activeNoticeIndex, setActiveNoticeIndex] = useState(0);
    const [currentDate, setCurrentDate] = useState('');

    const userData = [
        { name: "John Doe", address: "123 Main St, City", referral: "Sarah Smith", amount: 45.99, status: "Done" },
        { name: "Jane Smith", address: "456 Oak Ave, Town", referral: "Mike Johnson", amount: 45.99, status: "Done" },
        { name: "Robert Brown", address: "789 Pine Rd, Village", referral: "Lisa Davis", amount: 45.99, status: "Done" },
        { name: "Emma Wilson", address: "321 Elm St, County", referral: "Tom Wilson", amount: 45.99, status: "Done" }
    ];

    const notices = [
        "Stock market reaches new highs as tech sector surges.",
        "Federal Reserve announces plans to maintain current interest rates.",
        "Oil prices fluctuate amid geopolitical tensions.",
        "Cryptocurrency market experiences volatility following regulatory news.",
        "Major merger announced in the telecommunications industry.",
        "Retail sales data exceeds expectations, boosting consumer goods stocks."
    ];

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

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = userData.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.address.toLowerCase().includes(term) ||
            user.referral.toLowerCase().includes(term)
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
                        <img src="/img/dashlogo.jpg" alt="Dashboard logo" className="logodb"/>
                        <h1 className="dashboard-title">Dashboard</h1>
                        <span className="versionD">v.01</span>
                    </div>
                </div>
                <nav>
                    {[
                        { name: 'Dashboard', icon: '/img/icon-dashboard.png' },
                        { name: 'Add User', icon: '/img/icon-add-user.png' },
                        { name: 'View User List', icon: '/img/icon-user-list.png' },
                        { name: 'News Update', icon: '/img/icon-add-news.png', active: true },
                        { name: 'Add News', icon: '/img/icon-add-news.png' }
                    ].map((item, index) => (
                        <a key={item.name} href="#" className={`nav-itemdb ${item.active ? 'active' : ''}`}>
                            <div className="nav-item-contentdb">
                                <img src={item.icon} alt={`${item.name} icon`} className="nav-item-icon"/>
                                <span>{item.name}</span>
                            </div>
                            <span className="chevron-side">›</span>
                        </a>
                    ))}
                </nav>
                <div className="admin-profiledb">
                    <img src="/img/loka.jpg" alt="Admin" className="admin-avatardb"/>
                    <div className="admin-infodb">
                        <span className="admin-namedb">Admin Name</span>
                        <span className="admin-roledb">Account Head</span>
                    </div>
                   <a><ChevronDown className="chevron-db" /></a>
                </div>
            </aside>
            <main className="contentdb">
                <div className="dbadmin">
                    <div className="dbhello">
                        <img className="ad1" src="/img/hello-admin.png" alt="Hello Admin"/>
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
                        {[
                            { label: 'Total Investment', value: '5,00,000', img: '/img/money-recive.png' },
                            { label: 'Total Payout', value: '2,50,000', img: '/img/payout.png' },
                            { label: 'Total Users', value: '5,000', img: '/img/users.png' }
                        ].map((stat, index) => (
                            <div key={index} className="stat">
                                <div className="micon">
                                    <img className="bgimg" src="/img/Ellipse 3.png" alt="bg"/>
                                    <img className="bgl" src={stat.img} alt={`${stat.label} icon`}/>
                                </div>
                                <div className="text">
                                    <span className="label">{stat.label}</span>
                                    <span className="value">{stat.value}</span>
                                </div>
                            </div>
                        ))}
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
                                {notices.map((notice, index) => (
                                    <div key={index} className="notice-item">
                                        <p className="notice-item__text">{notice}</p>
                                    </div>
                                ))}
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
                            {filteredUsers.map((user, index) => (
                                <tr key={index} className="ud-table__row">
                                    <td className="ud-table__cell">
                                        <div className="ud-user">
                                            <div className="ud-user__avatar"></div>
                                            <div className="ud-user__info">
                                                <span className="ud-user__name">{user.name}</span>
                                                <span className="ud-user__address">{user.address}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="ud-table__cell">{user.referral}</td>
                                    <td className="ud-table__cell">${user.amount}</td>
                                    <td className="ud-table__cell ud-status--done">{user.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}