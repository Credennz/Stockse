import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./muserlist.css";

const MuserList = () => {
  const [payouts, setPayouts] = useState([]);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
  });
  const [editData, setEditData] = useState(null); // For editing a record

  const fetchPayouts = async () => {
    try {
      const { year, month } = filters;
      const response = await axios.get(
        `http://localhost:5001/api/payouts?year=${year}&month=${month}`
      );
      setPayouts(response.data);
    } catch (error) {
      console.error("Error fetching payouts:", error);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleEditClick = (payout) => {
    setEditData({ ...payout }); // Set data for editing
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5001/api/payouts/${id}`);
        fetchPayouts(); // Refresh data after deletion
      } catch (error) {
        console.error("Error deleting payout:", error);
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:5001/api/payouts/${editData.id}`, {
        payout_amount: editData.payout_amount,
        payment_status: editData.payment_status,
        invested_amount: editData.invested_amount,
      });
      setEditData(null); // Clear edit mode
      fetchPayouts(); // Refresh data after editing
    } catch (error) {
      console.error("Error updating payout:", error);
    }
  };

  const handleEditCancel = () => {
    setEditData(null); // Cancel edit mode
  };
  const [sidebarActive, setSidebarActive] = useState(false);
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
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
            <img
              src="/img/dashlogo.jpg"
              alt="Dashboard logo"
              className="logodb"
            />
            <h1 className="dashboard-title">Dashboard</h1>
            <span className="versionD">v.01</span>
          </div>
        </div>
        <nav>
          {[
            {
              name: "Dashboard",
              icon: "/img/icon-dashboard.png",
              link: "/adminhome",
            },
            {
              name: "Add User",
              icon: "/img/icon-add-user.png",
              link: "/adduser",
            },
            {
              name: "View User List",
              icon: "/img/icon-user-list.png",
              link: "/userlist",
            },
            {
              name: "News Update",
              icon: "/img/icon-add-news.png",
              link: "/newsupdate",
            },
            { name: "Add News", icon: "/img/icon-add-news.png", link: "/news" },
            {
              name: "Payment user list",
              icon: "/img/icon-add-news.png",
              link: "/muserlist",
            },
          ].map((item, index) => (
            <Link
              key={item.name}
              to={item.link}
              className={`nav-itemdb ${item.active ? "active" : ""}`}
            >
              <div className="nav-item-contentdb">
                <img
                  src={item.icon}
                  alt={`${item.name} icon`}
                  className="nav-item-icon"
                />
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
        <div className="payout-container">
          <h1 className="payout-title">Monthly Payouts</h1>
          <button
            className="btn test-next-month-btn"
            onClick={() => {
              const date = new Date();
              date.setMonth(date.getMonth() + 1); // Move to the next month
              setFilters({
                year: date.getFullYear(),
                month: (date.getMonth() + 1).toString().padStart(2, "0"),
              });
            }}
          >
            Test Next Month
          </button>

          <div className="filters">
            <label className="filter-label">Year: </label>
            <input
              className="filter-input"
              type="number"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
            />
            <label className="filter-label">Month: </label>
            <select
              className="filter-select"
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <table className="payout-table">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Invested Amount</th>
                <th className="table-header">Investment Date</th>
                <th className="table-header">Payout Month</th>
                <th className="table-header">Payment Status</th>
                <th className="table-header">Payout Amount</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) =>
                editData && editData.id === payout.id ? (
                  <tr key={payout.id} className="table-row editing-row">
                    <td className="table-cell">{payout.name}</td>
                    <td className="table-cell">{payout.invested_amount}</td>
                    <td className="table-cell">{payout.investment_date}</td>
                    <td className="table-cell">{payout.payout_month}</td>
                    <td className="table-cell">
                      <select
                        className="status-select"
                        name="payment_status"
                        value={editData.payment_status}
                        onChange={handleEditChange}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Done">Done</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </td>
                    <td className="table-cell">
                      <input
                        className="payout-input"
                        type="number"
                        name="payout_amount"
                        value={editData.payout_amount}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td className="table-cell actions-cell">
                      <button className="btn save-btn" onClick={handleEditSave}>
                        Save
                      </button>
                      <button
                        className="btn cancel-btn"
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={payout.id} className="table-row">
                    <td className="table-cell">{payout.name}</td>
                    <td className="table-cell">{payout.invested_amount}</td>
                    <td className="table-cell">
                      {payout.investment_date
                        ? new Date(payout.investment_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>
                    <td className="table-cell">{payout.payout_month}</td>
                    <td className="table-cell">{payout.payment_status}</td>
                    <td className="table-cell">{payout.payout_amount}</td>
                    <td className="table-cell actions-cell">
                      <button
                        className="btn edit-btn"
                        onClick={() => handleEditClick(payout)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn delete-btn"
                        onClick={() => handleDeleteClick(payout.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default MuserList;
