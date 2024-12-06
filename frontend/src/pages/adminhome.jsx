
// pages/Admin.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "../components/admin-home/home";
import "../components/admin-home/home.css";
import NewsUpdate from "../components/admin-newsupdate/newsupdate";
import "../components/admin-newsupdate/newsupdate.css";
import News from "../components/admin-news/news";
import "../components/admin-news/news.css";

import AddUserForm from "../components/admin-adduser/adduser";

export default function Adminhome() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="add-user" element={<AddUserForm />} />
        {/* <Route path="user-list" element={<UserList />} /> */}
        <Route path="news-update" element={<NewsUpdate />} />
        <Route path="add-news" element={<News />} />
      </Routes>
    </div>
  );
}
