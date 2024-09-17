import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/AdminDashboardLayout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faQuestionCircle, faEnvelope, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-dashboard-layout">
      <button className={`hamburger ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <Link to="/admin-dashboard">
                <FontAwesomeIcon icon={faHome} className="icon" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/users">
                <FontAwesomeIcon icon={faUser} className="icon" />
                Users
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/qna">
                <FontAwesomeIcon icon={faQuestionCircle} className="icon" />
                Q&A
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/messages">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                Messages
              </Link>
            </li>
            <li>
              <button onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
