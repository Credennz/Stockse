import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserHome from "../components/user-home/uhome";
import "../components/user-home/uhome.css";
// import UserNews from "../components/user-news/userNews";
import "../components/user-news/userNews.css";



export default function Userhome() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserHome />} />
        {/* <Route path="userNews" element={<uhome/>} /> */}
       
        {/* <Route path="/userNews" element={<UserNews />} /> */}
      </Routes>
    </div>
  );
}
