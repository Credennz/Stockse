import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bold, Italic, Strikethrough, LinkIcon, Trash2, Maximize, Table, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './newsupdate.css';

const API_URL = 'http://localhost:5000/api/news';

const NewsUpdate = () => {
    const [sidebarActive, setSidebarActive] = useState(false);
    const [newsHeading, setNewsHeading] = useState('');
    const [newsContent, setNewsContent] = useState('');
    const [newsImage, setNewsImage] = useState(null);
    const [newsVideo, setNewsVideo] = useState(null);
    const [recentNews, setRecentNews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingNewsId, setEditingNewsId] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const contentEditableRef = useRef(null);

    useEffect(() => {
        fetchNews();
    }, []);

    useEffect(() => {
        if (contentEditableRef.current) {
            contentEditableRef.current.focus();
            const range = document.createRange();
            const selection = window.getSelection();

            // Set cursor to the end of the content
            range.selectNodeContents(contentEditableRef.current);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }, []);

    const fetchNews = async () => {
        try {
            const response = await axios.get(API_URL);
            setRecentNews(response.data);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

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
        if (editorContent) {
            if (!document.fullscreenElement) {
                editorContent.requestFullscreen().catch((err) => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        }
    };

    const insertTable = () => {
        const rows = prompt('Enter number of rows:', '2');
        const cols = prompt('Enter number of columns:', '2');

        if (rows && cols) {
            let table = '<table border="1" style="border-collapse: collapse; width: 100%;">';
            for (let i = 0; i < parseInt(rows); i++) {
                table += '<tr>';
                for (let j = 0; j < parseInt(cols); j++) {
                    table += '<td style="padding: 5px;">Cell</td>';
                }
                table += '</tr>';
            }
            table += '</table>';
            document.execCommand('insertHTML', false, table);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewsImage(e.target.files[0]);
        }
    };

    const handleVideoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewsVideo(e.target.files[0]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!newsHeading || !newsContent) {
            alert('Please fill in both the news heading and content.');
            return;
        }
        setIsLoading(true);
        const formData = new FormData();
        formData.append('title', newsHeading);
        formData.append('content', newsContent);
        if (newsImage) {
            formData.append('image', newsImage);
        }
        if (newsVideo) {
            formData.append('video', newsVideo);
        }

        try {
            if (editingNewsId) {
                await axios.put(`${API_URL}/${editingNewsId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post(API_URL, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            await fetchNews();
            resetForm();
        } catch (error) {
            console.error('Error submitting news:', error);
            alert('An error occurred while submitting the news. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (news) => {
        setEditingNewsId(news.id);
        setNewsHeading(news.title);
        setNewsContent(news.content);
        setNewsImage(null);
        setNewsVideo(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                await fetchNews();
            } catch (error) {
                console.error('Error deleting news:', error);
                alert('An error occurred while deleting the news. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setEditingNewsId(null);
        setNewsHeading('');
        setNewsContent('');
        setNewsImage(null);
        setNewsVideo(null);
        const imageInput = document.getElementById('news-image');
        const videoInput = document.getElementById('news-video');
        if (imageInput) imageInput.value = '';
        if (videoInput) videoInput.value = '';
    };

    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    const handleContentChange = (e) => {
        const newContent = e.target.textContent;
        setNewsContent(newContent);
        
        // Ensure cursor stays at the end
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(e.target);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
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
                    {[
                        { name: 'Dashboard', icon: '/img/icon-dashboard.png', link: '/adminhome' },
                        { name: 'Add User', icon: '/img/icon-add-user.png', link: '/adduser' },
                        { name: 'View User List', icon: '/img/icon-user-list.png', link: '/userlist' },
                        { name: 'News Update', icon: '/img/icon-add-news.png', link: '/newsupdate' },
                        { name: 'Add News', icon: '/img/icon-add-news.png', link: '/news' },
                        { name: 'Payment user list', icon: '/img/icon-add-news.png', link: '/muserlist' }
                    ].map((item) => (
                        <Link key={item.name} to={item.link} className="nav-itemdb">
                            <div className="nav-item-contentdb">
                                <img src={item.icon} alt={`${item.name} icon`} className="nav-item-icon"/>
                                <span>{item.name}</span>
                            </div>
                            <span className="chevron-side">›</span>
                        </Link>
                    ))}
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
                            <button type="button" onClick={insertLink} title="Insert Link"><LinkIcon /></button>
                            <button type="button" onClick={removeFormat} title="Clear Formatting"><Trash2 /></button>
                            <button type="button" onClick={toggleFullscreen} title="Fullscreen"><Maximize /></button>
                            <button type="button" onClick={insertTable} title="Insert Table"><Table /></button>
                            <button type="button" onClick={togglePreview} title="Toggle Preview">
                                {showPreview ? 'Edit' : 'Preview'}
                            </button>
                        </div>
                        {showPreview ? (
                            <div 
                                className="news-content preview" 
                            >{newsContent}</div>
                        ) : (
                            <div
                                id="news-content"
                                dir="ltr"
                                className="news-content"
                                contentEditable
                                onKeyUp={handleContentChange}
                                style={{ textAlign: 'left' }}
                                ref={contentEditableRef}
                            >
                                {newsContent}
                            </div>
                        )}
                    </div>
                    <div className="newsH-group">
                        <label htmlFor="news-image" className="newsH-label">News Image</label>
                        <input
                            type="file"
                            id="news-image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="newsH-group">
                        <label htmlFor="news-video" className="newsH-label">News Video</label>
                        <input
                            type="file"
                            id="news-video"
                            accept="video/*"
                            onChange={handleVideoChange}
                        />
                    </div>
                    <div className="newsH-submit-container">
                        <button type="submit" className="newsH-submit" disabled={isLoading}>
                            {isLoading ? 'Submitting...' : (editingNewsId ? 'Update' : 'Submit')}
                        </button>
                        {editingNewsId && (
                            <button type="button" className="newsH-cancel" onClick={resetForm}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
                <div className="recent-news">
                    <h2>Recent News</h2>
                    {recentNews.map((news) => (
                        <div key={news.id} className="news-item">
                            <h3>{news.title}</h3>
                            {news.image && <img src={news.image} alt={news.title} className="news-image" />}
                            {news.video && (
                                <video controls className="news-video">
                                    <source src={news.video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            <div dangerouslySetInnerHTML={{ __html: news.content }}></div>
                            <div className="news-actions">
                                <button onClick={() => handleEdit(news)} className="edit-btn">
                                    <Edit size={16} /> Edit
                                </button>
                                <button onClick={() => handleDelete(news.id)} className="delete-btn">
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <style jsx>{`
                .news-content {
                    border: 1px solid #ccc;
                    padding: 10px;
                    min-height: 200px;
                }
                .news-content.preview {
                    background-color: #f9f9f9;
                }
            `}</style>
        </div>
    );
};

export default NewsUpdate;

