import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, updateUserLastLogin } from '../firebase';

function InputField({ label, type, value, onChange }) {
  return (
    <div className="mt-4 w-full max-w-xs mx-auto"> {/* Centered content */}
      <label htmlFor={`${type}Input`} className="block mt-4 mb-1 text-sm sm:text-base text-slate-700">
        {label}
      </label>
      <input
        type={type}
        id={`${type}Input`}
        className="w-full px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-zinc-100 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder={`Enter your ${type.toLowerCase()} here`}
        value={value}
        onChange={onChange}
        required
        aria-required="true"
      />
    </div>
  );
}

function SignInButton() {
  return (
    <div className="flex justify-center mt-4 sm:mt-8"> {/* Centered button */}
      <button
        type="submit"
        className="w-[200px] sm:w-[200px] md:w-auto px-6 sm:px-16 py-2 text-center text-white bg-green-500 rounded-lg sm:rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Sign In
      </button>
    </div>
  );
}

function GoogleSignIn({ onClick }) {
  return (
    <div className="mt-4 w-full flex justify-center">
      <button
        type="button"
        className="flex justify-center items-center w-full sm:w-auto px-4 py-2 bg-white border border-blue-200 rounded-full text-sm font-medium text-stone-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        onClick={onClick}
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/af84bb12a2c7d8d29507116e58715db90ad8315a5c7e34e6c4d18623b5a975ca?placeholderIfAbsent=true&apiKey=da83ea99f57e4ae4aae95e52ae6de655"
          className="w-5 h-5 mr-2"
          alt="Google sign-in icon"
        />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
}

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (email === 'xigok72017@mposhop.com' && password === '12345678') {
      // Redirect to admin dashboard
      navigate('/admin-dashboard');
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateUserLastLogin(user.uid);
        navigate('/dashboard');
      } catch (err) {
        console.error('SignIn error:', err); // Log the full error
        if (err.code === 'auth/wrong-password') {
          setError('Incorrect password. Please try again.');
        } else if (err.code === 'auth/user-not-found') {
          setError('No user found with this email. Please sign up first.');
        } else if (err.code === 'permission-denied') {
          setError('Missing or insufficient permissions.');
        } else {
          setError('An error occurred. Please try again later.');
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await updateUserLastLogin(result.user.uid);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google SignIn error:', err); // Log the full error
      if (err.code === 'permission-denied') {
        setError('Missing or insufficient permissions.');
      } else {
        setError('An error occurred during Google Sign-In. Please try again later.');
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-10 py-12 sm:py-20 md:py-28 mx-auto w-full text-base sm:text-lg text-gray-500 bg-white">
      <div className="w-full max-w-[480px] flex-grow flex flex-col justify-center items-center"> {/* Centered content */}
        <header className="text-center">
          <h1 className="text-slate-700 font-light text-xl sm:text-2xl">
            Welcome back to
            <span className="block mt-2 sm:mt-3 text-5xl sm:text-6xl">CKDFree</span>
          </h1>
        </header>
        <form className="w-full mt-4 sm:mt-12 md:mt-20 md:mt-0" onSubmit={handleSignIn}>
          <InputField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <SignInButton />
        </form>
        <GoogleSignIn onClick={handleGoogleSignIn} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <footer className="mt-4 text-center">
          <p><a href="#" onClick={() => navigate('/forgot-password')}>Forgot your password?</a></p>
          <p>Don’t have an account? <a href="#" onClick={() => navigate('/signup')}>Register here</a></p>
        </footer>
      </div>
    </main>
  );
};

export default SignIn;
