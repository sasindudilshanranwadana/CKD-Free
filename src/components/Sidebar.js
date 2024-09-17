import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChartLine, FaQuestionCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>CKDFree</h2>
      <nav>
        <ul>
          <li><Link to="/dashboard"><FaHome /> Dashboard</Link></li>
          <li><Link to="/performance"><FaChartLine /> Performance</Link></li>
          <li><Link to="/qna"><FaQuestionCircle /> Q&A</Link></li>
          <li><Link to="/settings"><FaCog /> Settings</Link></li>
          <li><Link to="/signin"><FaSignOutAlt /> Logout</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
