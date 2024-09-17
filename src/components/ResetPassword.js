import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const actionCodeSettings = {
        url: 'https://data.sasiverse.com/new-password-setup',
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      alert('Password reset email sent. Please check your inbox.');
      navigate('/signin');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      {loading ? (
        <Loading />
      ) : (
        <div className="signin-card">
          <h1>Reset Password</h1>
          <form onSubmit={handlePasswordReset}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Send Password Reset Link</button>
          </form>
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
