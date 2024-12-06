import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Menu, ChevronRight } from "lucide-react";
import {   User, Mail, Lock, Phone, MapPin, UserPlus, DollarSign, Calendar, Briefcase, Hash, Clock, FileText, ChevronDown, X } from 'lucide-react';
import './adduser.css'; // Add your CSS file path here

const api = axios.create({
  baseURL: "http://localhost:5001/api", // Backend server URL
});

const AddUserForm = ({ fetchUsers, editingUser, setEditingUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    referredBy: "",
    investedAmount: "",
    investmentDate: "",
    returnPOC: "",
    pocNumber: "",
    dueDate: "",
    timeInterval: "",
    agreementFile: null,
  });

  const [sidebarActive, setSidebarActive] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFormData(editingUser);
    }
  }, [editingUser]);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  

  const handleFileChange = (e) => {
    setFormData({ ...formData, agreementFile: e.target.files[0] });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formDataToSend);
        setEditingUser(null);
      } else {
        await api.post("/users", formDataToSend);
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        referredBy: "",
        investedAmount: "",
        investmentDate: "",
        returnPOC: "",
        pocNumber: "",
        dueDate: "",
        timeInterval: "",
        agreementFile: null,
      });
      fetchUsers();
    } catch (error) {
      // console.error("Failed to submit form:", error.message);
      // alert("Error submitting form. Please check console for details.");
    }
  };

  return (
    <div className="dashboard-admin">
      {/* Sidebar Toggle Button */}
      <button id="menuToggle" className="menu-toggle" onClick={toggleSidebar}>
        <Menu />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarActive ? "active" : ""}`}>
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
        <div className="admin-profiledb">
          <img src="/img/loka.jpg" alt="Admin" className="admin-avatardb" />
          <div className="admin-infodb">
            <span className="admin-namedb">Admin Name</span>
            <span className="admin-roledb">Account Head</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="contentdb1">
        
        <form onSubmit={handleAddUser} className="user-form">
        <h2>{editingUser ? "Edit User" : "Add User"}</h2>
            <div className="form-group">
              <User size={20} />
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <Mail size={20} />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <Lock size={20} />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <Phone size={20} />
              <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <MapPin size={20} />
              <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <UserPlus size={20} />
              <input type="text" name="referredBy" placeholder="Referred By" value={formData.referredBy} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <DollarSign size={20} />
              <input type="number" name="investedAmount" placeholder="Invested Amount" value={formData.investedAmount} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <Calendar size={20} />
              <input type="date" name="investmentDate" placeholder="Investment Date" value={formData.investmentDate} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <Briefcase size={20} />
              <input type="text" name="returnPOC" placeholder="Return POC" value={formData.returnPOC} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <Hash size={20} />
              <input type="text" name="pocNumber" placeholder="POC Number" value={formData.pocNumber} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <Calendar size={20} />
              <input type="date" name="dueDate" placeholder="Due Date" value={formData.dueDate} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <Clock size={20} />
              <input type="text" name="timeInterval" placeholder="Time Interval" value={formData.timeInterval} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <FileText size={20} />
              <input type="file" name="agreementFile" onChange={handleFileChange} />
            </div>
            <button type="submit">{editingUser ? "Update User" : "Add User"}</button>
          </form>
      </main>
    </div>
  );
};

export default AddUserForm;
