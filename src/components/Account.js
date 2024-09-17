// src/components/Account.js
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { updateEmail, updatePassword } from 'firebase/auth';

const Account = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');

  useEffect(() => {
    if (auth.currentUser) {
      setCurrentEmail(auth.currentUser.email);
    }
  }, []);

  const handleUpdateEmail = async () => {
    try {
      await updateEmail(auth.currentUser, email);
      console.log('Email updated');
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await updatePassword(auth.currentUser, password);
      console.log('Password updated');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  return (
    <div>
      <h2>Account Information</h2>
      <p>Current Email: {currentEmail}</p>
      <input
        type="email"
        placeholder="New Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleUpdateEmail}>Update Email</button>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleUpdatePassword}>Update Password</button>
    </div>
  );
};

export default Account;
