import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Adminhome from './pages/adminhome';
import Userhome from './pages/userhome';
import Login from './pages/loginpage';
import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import NewsUpdate from "./components/admin-newsupdate/newsupdate";
import News from "./components/admin-news/news";
import UserList from "./components/admin-user-list/userlist";
import AddUserForm from "./components/admin-adduser/adduser";
import MuserList from './components/admin-user-list/muserlist';
import UserNews from "./components/user-news/userNews";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/adminhome"
            element={<PrivateRoute allowedRole="admin" element={<Adminhome />} />}
          />
          <Route
            path="/userhome"
            element={<PrivateRoute element={<Userhome />} allowedRole="user" />}
          />
          <Route
            path="/news"
            element={<PrivateRoute allowedRole="admin" element={<News />} />}
          />
          <Route
            path="/newsupdate"
            element={<PrivateRoute allowedRole="admin" element={<NewsUpdate />} />}
          />
          <Route
            path="/userlist"
            element={<PrivateRoute allowedRole="admin" element={<UserList />} />}
          />
          <Route
            path="/muserlist"
            element={<PrivateRoute allowedRole="admin" element={<MuserList />} />}
          />
          <Route
            path="/adduser"
            element={<PrivateRoute allowedRole="admin" element={<AddUserForm />} />}
          />
          <Route
            path="/userNews"
            element={<PrivateRoute allowedRole="user" element={<UserNews />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
