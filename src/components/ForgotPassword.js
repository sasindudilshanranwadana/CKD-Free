import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (err) {
      setError('Failed to send password reset email. Please try again later.');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-10 py-12 sm:py-20 md:py-28 mx-auto w-full text-base sm:text-lg text-gray-500 bg-white">
      <div className="w-full max-w-[480px] flex-grow flex flex-col justify-center items-center"> {/* Centered content */}
        <header className="text-center">
          <h1 className="text-slate-700 font-light text-xl sm:text-2xl">
            Forgot your password?
            <span className="block mt-2 sm:mt-3 text-5xl sm:text-6xl">CKDFree</span>
          </h1>
          <p className="mt-4 text-base text-gray-500">Enter your email address below to receive a password reset email.</p>
        </header>
        <form onSubmit={handlePasswordReset} className="w-full mt-8 sm:mt-12 md:mt-20">
          <div className="mt-4 w-full max-w-xs mx-auto">
            <input
              type="email"
              placeholder="Enter your email address here"
              className="w-full px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-zinc-100 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div className="flex justify-center mt-8 sm:mt-12">
            <button
              type="submit"
              className="w-[200px] sm:w-[200px] md:w-auto px-6 sm:px-16 py-2 text-center text-white bg-green-500 rounded-lg sm:rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Send Reset Email
            </button>
          </div>
        </form>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <footer className="mt-4 text-center">
          <p><a href="#" onClick={() => navigate('/signin')}>Back to Sign In</a></p>
        </footer>
      </div>
    </main>
  );
};

export default ForgotPassword;
