import React from 'react';
import { ChevronDown } from 'lucide-react';

const Sidebar = ({ isActive }) => {
  return (
    <aside className={`sidebar ${isActive ? 'active' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <img src="/placeholder.svg?height=32&width=32" alt="Dashboard logo" className="logodb" />
          <h1 className="dashboard-title">StockSe</h1>
          <span className="version">v.01</span>
        </div>
      </div>
      <nav>
        <a href="#" className="nav-item">
          <div className="nav-item-content">
            <img src="/placeholder.svg?height=24&width=24" alt="Dashboard icon" className="nav-item-icon" />
            <span>Dashboard</span>
          </div>
          <span className="chevron">›</span>
        </a>
        <a href="#" className="nav-item">
          <div className="nav-item-content">
            <img src="/placeholder.svg?height=24&width=24" alt="News Update icon" className="nav-item-icon" />
            <span>News Update</span>
          </div>
          <span className="chevron">›</span>
        </a>
      </nav>
      <div className="up-card">
        <div className="UP-poc-section">
          <div className="UP-poc-title">Your POC (Point of Contact)</div>
          <div className="UP-poc-card">
            <div className="UP-poc-info">
              <div className="UP-poc-avatar">
                <img src="/placeholder.svg?height=40&width=40" alt="POC avatar" />
              </div>
              <div className="UP-poc-details">
                <div className="UP-poc-name">John Maverick</div>
                <div className="UP-poc-position">Accounts Head</div>
              </div>
            </div>
            <button className="UP-contact-button">Contact POC</button>
          </div>
        </div>
        <div className="admin-profile">
          <img src="/placeholder.svg?height=40&width=40" alt="Admin" className="admin-avatar" />
          <div className="admin-info">
            <span className="admin-name">Admin Name</span>
            <span className="admin-role">Account Head</span>
          </div>
          <ChevronDown className="chevron-db" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;