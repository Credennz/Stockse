// import React, { useState, useEffect } from 'react';
// import { Menu } from 'lucide-react';
// import Sidebar from '../components/user-pannel/Sidebar';
// import HeaderUser from '../components/user-pannel/HeaderUser';
// import StatUser from '../components/user-pannel/StatUser';
// import EarningUser from '../components/user-pannel/EarningUser';
// import NoticeboardUser from '../components/user-pannel/NoticeboardUser';
// import PaymentUser from '../components/user-pannel/PaymentUser';
// import '../style/User-Dashboard.css';

// const UserDashboard = () => {
//   const [isSidebarActive, setIsSidebarActive] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarActive(!isSidebarActive);
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth > 768) {
//         setIsSidebarActive(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const sidebar = document.querySelector('.sidebar');
//       const menuToggle = document.getElementById('menuToggle');
//       if (sidebar && menuToggle) {
//         const isClickInsideSidebar = sidebar.contains(event.target);
//         const isClickOnMenuToggle = menuToggle.contains(event.target);
//         if (!isClickInsideSidebar && !isClickOnMenuToggle && window.innerWidth <= 768) {
//           setIsSidebarActive(false);
//         }
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   return (
//     <div className="dashboard">
//       <button id="menuToggle" className="menu-toggle" onClick={toggleSidebar}>
//         <Menu size={24} />
//       </button>
//       <Sidebar isActive={isSidebarActive} />
//       <main className="content">
//         <HeaderUser />
//         <StatUser />
//         <div className="cab-a">
//           <EarningUser />
//           <NoticeboardUser />
//         </div>
//         <PaymentUser />
//       </main>
//     </div>
//   );
// };

// export default UserDashboard;