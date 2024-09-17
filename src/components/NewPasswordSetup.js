import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase';
import Loading from './Loading';
import '../styles/NewPasswordSetup.css';

const NewPasswordSetup = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const oobCode = new URLSearchParams(location.search).get('oobCode');

  useEffect(() => {
    if (!oobCode) {
      navigate('/signin');
    } else {
      setLoading(false);
    }
  }, [oobCode, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await confirmPasswordReset(auth, oobCode, password);
      alert('Password has been reset successfully. Please sign in with your new password.');
      navigate('/signin');
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1>Set New Password</h1>
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordSetup;
