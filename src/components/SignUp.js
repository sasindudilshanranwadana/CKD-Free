import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';

function InputField({ label, type, value, onChange }) {
  return (
    <div className="mt-4 sm:mt-0 sm:mb-2 w-full max-w-xs mx-auto"> {/* Centered content */}
      <label htmlFor={`${type}Input`} className="block mt-4 mb-1 text-sm sm:text-base text-slate-700 text-center">
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

function SignUpButton() {
  return (
    <div className="flex justify-center mt-4 sm:mt-8"> {/* Centered button */}
      <button
        type="submit"
        className="w-[200px] sm:w-[200px] md:w-auto px-6 sm:px-16 py-2 text-center text-white bg-green-500 rounded-lg sm:rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Sign Up
      </button>
    </div>
  );
}

function GoogleSignIn({ onClick }) {
  return (
    <div className="mt-6 w-full flex justify-center">
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
        <span>Sign up with Google</span>
      </button>
    </div>
  );
}

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        role: 'user'
      });

      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use. Please use a different email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address. Please check and try again.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ')[1] || '',
          role: 'user'
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred during Google Sign-Up. Please try again later.');
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen px-4 sm:px-6 md:px-10 py-12 sm:py-20 md:py-28 mx-auto w-full text-base sm:text-lg text-gray-500 bg-white">
      <div className="w-full max-w-[480px] flex-grow flex flex-col justify-center items-center">
        <header>
          <h1 className="text-center text-slate-700 font-light text-xl sm:text-2xl">
            Welcome to
            <span className="block mt-2 sm:mt-3 text-5xl sm:text-6xl">CKDFree</span>
          </h1>
        </header>
        <p className="mt-4 text-center">To get started, let’s create an account. Please enter an email that you have access to, and think of a strong password. Don’t forget to write it down!</p>
        <form className="w-full mt-8 sm:mt-12 md:mt-20 md:mt-0" onSubmit={handleSignUp}>
          <InputField label="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <InputField label="Last Name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <InputField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <SignUpButton />
        </form>
        <GoogleSignIn onClick={handleGoogleSignIn} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <footer className="mt-6 text-center">
          <p>Already have an account? <a href="#" onClick={() => navigate('/signin')}>Login here</a></p>
        </footer>
      </div>
    </main>
  );
};

export default SignUp;
