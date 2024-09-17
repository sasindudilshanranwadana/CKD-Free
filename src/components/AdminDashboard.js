import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      setTotalUsers(usersSnapshot.size);

      const questionsCollection = collection(db, 'questions');
      const questionsSnapshot = await getDocs(questionsCollection);
      setTotalQuestions(questionsSnapshot.size);

      const messagesCollection = collection(db, 'messages');
      const messagesSnapshot = await getDocs(messagesCollection);
      setTotalMessages(messagesSnapshot.size);
    };

    fetchData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="admin-stats">
        <div className="stat-box">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-box">
          <h3>Total Q&A</h3>
          <p>{totalQuestions}</p>
        </div>
        <div className="stat-box">
          <h3>Total Messages</h3>
          <p>{totalMessages}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
