import React, { useState } from 'react';
import { Menu, Bold, Italic, Strikethrough, Link, Trash2, Maximize, Table } from 'lucide-react';
import '../admin-newsupdate/newsupdate.css';

const NewsUpdate = () => {
    const [sidebarActive, setSidebarActive] = useState(false);
    const [newsHeading, setNewsHeading] = useState('');
    const [newsContent, setNewsContent] = useState('');
    const [recentNews, setRecentNews] = useState([
        { id: 1, title: "Major tech company announces new product line", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
        { id: 2, title: "Stock market reaches all-time high", content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
        { id: 3, title: "New environmental policy implemented nationwide", content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
    ]);

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
    };

    const formatText = (command) => {
        document.execCommand(command, false, null);
    };

    const insertLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    };

    const removeFormat = () => {
        document.execCommand('removeFormat', false, null);
    };

    const toggleFullscreen = () => {
        const editorContent = document.getElementById('news-content');
        if (!document.fullscreenElement) {
            editorContent.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const insertTable = () => {
        const rows = prompt('Enter number of rows:', '2');
        const cols = prompt('Enter number of columns:', '2');

        if (rows && cols) {
            let table = '<table border="1" style="border-collapse: collapse; width: 100%;">';
            for (let i = 0; i < rows; i++) {
                table += '<tr>';
                for (let j = 0; j < cols; j++) {
                    table += '<td style="padding: 5px;">Cell</td>';
                }
                table += '</tr>';
            }
            table += '</table>';
            document.execCommand('insertHTML', false, table);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newNews = {
            id: Date.now(),
            title: newsHeading,
            content: newsContent
        };
        setRecentNews([newNews, ...recentNews]);
        setNewsHeading('');
        setNewsContent('');
    };

    return (
        <div className="dashboard-admin">
            <button id="menuToggle" className="menu-toggle" onClick={toggleSidebar}>
                <Menu />
            </button>
            <aside className={`sidebar ${sidebarActive ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <div className="logodb">
                        <img src="/img/dashlogo.jpg" alt="Dashboard logo" className="logodb" />
                        <h1 className="dashboard-title">Dashboard</h1>
                        <span className="versionD">v.01</span>
                    </div>
                </div>
                <nav>
                    <a href="#" className="nav-itemdb active">
                        <div className="nav-item-contentdb">
                            <img src="/img/icon-dashboard.png" alt="Dashboard icon" className="nav-item-icon" />
                            <span>Dashboard</span>
                        </div>
                        <span className="chevron-side">›</span>
                    </a>
                    <a href="#" className="nav-itemdb">
                        <div className="nav-item-contentdb">
                            <img src="/img/icon-add-user.png" alt="Add User icon" className="nav-item-icon" />
                            <span>Add User</span>
                        </div>
                        <span className="chevron-side">›</span>
                    </a>
                    <a href="#" className="nav-itemdb">
                        <div className="nav-item-contentdb">
                            <img src="/img/icon-user-list.png" alt="View User List icon" className="nav-item-icon" />
                            <span>View User List</span>
                        </div>
                        <span className="chevron-side">›</span>
                    </a>
                    <a href="#" className="nav-itemdb">
                        <div className="nav-item-contentdb">
                            <img src="/img/icon-add-news.png" alt="News Update icon" className="nav-item-icon" />
                            <span>News Update</span>
                        </div>
                        <span className="chevron-side">›</span>
                    </a>
                </nav>
                <div className="admin-profiledb">
                    <img src="/img/loka.jpg" alt="Admin" className="admin-avatardb" />
                    <div className="admin-infodb">
                        <span className="admin-namedb">Admin Name</span>
                        <span className="admin-roledb">Account Head</span>
                    </div>
                </div>
            </aside>
            <main className="contentdb">
                <header className="newsH-header">Hello Admin 👋🏼</header>
                <form id="news-form" onSubmit={handleSubmit}>
                    <div className="newsH-group">
                        <label htmlFor="news-heading" className="newsH-label">News Heading</label>
                        <input
                            type="text"
                            id="news-heading"
                            className="newsH-input"
                            value={newsHeading}
                            onChange={(e) => setNewsHeading(e.target.value)}
                            required
                        />
                    </div>
                    <div className="newsH-group">
                        <label htmlFor="news-content" className="newsH-label">News Content</label>
                        <div className="toolbar">
                            <button type="button" onClick={() => formatText('bold')} title="Bold"><Bold /></button>
                            <button type="button" onClick={() => formatText('italic')} title="Italic"><Italic /></button>
                            <button type="button" onClick={() => formatText('strikethrough')} title="Strikethrough"><Strikethrough /></button>
                            <button type="button" onClick={insertLink} title="Insert Link"><Link /></button>
                            <button type="button" onClick={removeFormat} title="Clear Formatting"><Trash2 /></button>
                            <button type="button" onClick={toggleFullscreen} title="Fullscreen"><Maximize /></button>
                            <button type="button" onClick={insertTable} title="Insert Table"><Table /></button>
                        </div>
                        <div
                            id="news-content"
                            className="news-content"
                            contentEditable
                            onInput={(e) => setNewsContent(e.target.innerHTML)}
                        ></div>
                    </div>
                    <div className="newsH-submit-container">
                        <button type="submit" className="newsH-submit">Submit</button>
                    </div>
                </form>
                {/* <div className="news-content-box">
                    <h2>Recent News</h2>
                    <div className="news-list">
                        {recentNews.map((news) => (
                            <div key={news.id} className="news-item">
                                <h3>{news.title}</h3>
                                <p>{news.content}</p>
                            </div>
                        ))}
                    </div>
                </div> */}
            </main>
        </div>
    );
};

export default NewsUpdate;