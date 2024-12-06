import React, { useState, useEffect } from "react";
import axios from "axios";
import "./userlist.css";
import { Link } from "react-router-dom";
import { Menu, ChevronRight } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarActive, setSidebarActive] = useState(false);

  // Fetch users data from API
  const fetchData = async () => {
    try {
      const usersResponse = await axios.get("http://localhost:5001/api/users");
      setUsers(usersResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setEditUserData({ ...user });
  };

  const handleSaveUser = async () => {
    try {
      const formData = new FormData();
      Object.keys(editUserData).forEach((key) => {
        if (key !== "agreementFile") {
          formData.append(key, editUserData[key]);
        }
      });

      if (editUserData.agreementFile) {
        formData.append("agreementFile", editUserData.agreementFile);
      }

      await axios.put(`http://localhost:5001/api/users/${editingUserId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUserId ? { ...user, ...editUserData } : user
        )
      );
      setEditingUserId(null);
      setSuccessMessage("User updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleCancelUserEdit = () => {
    setEditingUserId(null);
    setEditUserData({});
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5001/api/users/${userId}`);
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleDownload = (fileName) => {
    const fileUrl = `http://localhost:5001/uploads/${fileName}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-admin">
      <button id="menuToggle" className="menu-toggle" onClick={toggleSidebar}>
        <Menu />
      </button>

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

      <main className="contentdb1">
        <div className="user-management-container">
          <h1 className="user-management-title">User Management</h1>
          {successMessage && <div className="user-management-success-message">{successMessage}</div>}

          <div className="user-management-search-container">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="user-management-search-input"
            />
          </div>

          <div className="user-management-table-container">
            <table className="user-management-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Referred By</th>
                  <th>Return POC</th>
                  <th>POC Number</th>
                  <th>Time Interval</th>
                  <th>Invested Amount</th>
                  <th>Investment Date</th>
                  <th>Agreement File</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) =>
                  editingUserId === user.id ? (
                    <tr key={user.id} className="user-management-edit-row">
                      <td>
                        <input
                          className="user-management-input"
                          type="text"
                          value={editUserData.name || ""}
                          onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="user-management-input"
                          type="email"
                          value={editUserData.email || ""}
                          onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="user-management-input"
                          type="password"
                          value={editUserData.password || ""}
                          onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="user-management-input"
                          type="text"
                          value={editUserData.phone || ""}
                          onChange={(e) => setEditUserData({ ...editUserData, phone: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="user-management-input"
                          type="text"
                          value={editUserData.address || ""}
                          onChange={(e) => setEditUserData({ ...editUserData, address: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="user-management-input"
                          type="text"
                          value={editUserData.referredBy || ""}
                          onChange={(e) => setEditUserData({ ...editUserData, referredBy: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="user-management-input"
                          type="text"
                          value={editUserData.returnPOC || ""}
                          onChange={(e) => setEditUserData({ ...editUserData, returnPOC: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="user-management-input"
                          type="text"
                          value={editUserData.pocNumber || ""}
                          onChange={(e) => setEditUserData({ ...editUserData, pocNumber: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="user-management-input"
                          type="text"
                          value={editUserData.timeInterval || ""}
                          onChange={(e) => setEditUserData({ ...editUserData, timeInterval: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="user-management-input"
                          type="number"
                          value={editUserData.investedAmount || ""}
                          onChange={(e) => setEditUserData({ ...editUserData, investedAmount: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="user-management-input"
                          type="date"
                          value={editUserData.investmentDate || ""}
                          onChange={(e) => setEditUserData({ ...editUserData, investmentDate: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="user-management-file-input"
                          type="file"
                          onChange={(e) =>
                            setEditUserData({ ...editUserData, agreementFile: e.target.files[0] })
                          }
                        />
                      </td>
                      <td>
                        <button className="user-management-button user-management-save-button" onClick={handleSaveUser}>Save</button>
                        <button className="user-management-button user-management-cancel-button" onClick={handleCancelUserEdit}>Cancel</button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={user.id} className="user-management-row">
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.password}</td>
                      <td>{user.phone}</td>
                      <td>{user.address}</td>
                      <td>{user.referredBy}</td>
                      <td>{user.returnPOC}</td>
                      <td>{user.pocNumber}</td>
                      <td>{user.timeInterval}</td>
                      <td>{user.investedAmount || "N/A"}</td>
                      <td>
                        {user.investmentDate
                          ? new Date(user.investmentDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                          : 'N/A'
                        }
                      </td>
                      <td>
                        {user.agreementFile ? (
                          <button className="user-management-button user-management-view-button" onClick={() => handleDownload(user.agreementFile)}>View Agreement</button>
                        ) : (
                          "No file"
                        )}
                      </td>
                      <td>
                        <button className="user-management-button user-management-edit-button" onClick={() => handleEditUser(user)}>Edit</button>
                        <button className="user-management-button user-management-delete-button" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserList;

