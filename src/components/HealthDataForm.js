import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from './Loading';
import backIcon from '../assets/back.png';

const HealthDataForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [dietRating, setDietRating] = useState('');
  const [alcoholDays, setAlcoholDays] = useState('');
  const [smoking, setSmoking] = useState('');
  const [exercise, setExercise] = useState('');
  const [kidneyDisease, setKidneyDisease] = useState('');
  const [sex, setSex] = useState('');
  const [indigenousStatus, setIndigenousStatus] = useState('');
  const [diabetes, setDiabetes] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        navigate('/signin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (setter) => (value) => {
    setter(prevValue => prevValue === value ? '' : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !dob || !dietRating || !alcoholDays || !smoking || !exercise || !kidneyDisease || !sex || !indigenousStatus || !diabetes) {
      setMessage('Please fill out all fields.');
      return;
    }

    try {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDoc, {
        firstName,
        lastName,
        dob,
        dietRating,
        alcoholDays,
        smoking,
        exercise,
        kidneyDisease,
        sex,
        indigenousStatus,
        diabetes,
        hasCompletedHealthData: true,
        createdAt: new Date()
      }, { merge: true });

      setMessage('Your data has been submitted successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error adding document: ', error);
      setMessage('There was an error submitting your data. Please try again.');
    }
  };

  const handleSkip = async () => {
    try {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDoc, {
        hasCompletedHealthData: true
      }, { merge: true });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error skipping data: ', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="flex flex-col items-center min-h-screen px-4 sm:px-6 md:px-10 py-12 sm:py-20 md:py-28 mx-auto w-full text-base sm:text-lg text-gray-500 bg-white">
      <div className="w-full max-w-[480px] flex-grow flex flex-col justify-center items-center"> {/* Centered content */}
        <header className="flex items-center mb-4 w-full">
          <img src={backIcon} alt="Back" className="w-6 h-6 cursor-pointer mr-2" onClick={() => navigate('/dashboard')} />
          <h1 className="text-2xl font-semibold">Before we get started...</h1>
        </header>
        <p className="text-sm text-gray-500 mb-6 text-center">
          There are some details we’d like to be able to collect to help further research and make improved recommendations for you. Please fill in the information you are comfortable with sharing.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <input
              type="text"
              placeholder="Enter text here"
              className="w-full p-2 bg-gray-200 rounded-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <input
              type="text"
              placeholder="Enter text here"
              className="w-full p-2 bg-gray-200 rounded-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              className="w-full p-2 bg-gray-200 rounded-full"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Do you have Kidney disease?</label>
            <div className="flex justify-between items-center bg-gray-200 rounded-full p-1 h-10.5">
              {['Yes', 'No'].map((value, index) => (
                <button
                  type="button"
                  key={index}
                  className={`flex-1 py-2 text-sm rounded-full ${
                    kidneyDisease === value.toLowerCase() ? 'bg-gray-500 text-white' : 'bg-gray-200'
                  } hover:bg-gray-300 transition duration-200`}
                  onClick={() => handleInputChange(setKidneyDisease)(value.toLowerCase())}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sex</label>
            <div className="flex justify-between items-center bg-gray-200 rounded-full p-1 h-10.5">
              {['Male', 'Female', 'Other'].map((value, index) => (
                <button
                  type="button"
                  key={index}
                  className={`flex-1 py-2 text-sm rounded-full ${
                    sex === value.toLowerCase() ? 'bg-gray-500 text-white' : 'bg-gray-200'
                  } hover:bg-gray-300 transition duration-200`}
                  onClick={() => handleInputChange(setSex)(value.toLowerCase())}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          {/* Add similar sections for other fields */}
          <button type="submit" className="w-full py-3 mt-4 bg-green-500 text-white rounded-full text-lg font-semibold">
            Submit Answers
          </button>
          <button type="button" className="w-full py-3 mt-2 bg-gray-300 text-black rounded-full text-lg font-semibold" onClick={handleSkip}>
            Skip
          </button>
        </form>
        {message && <p className="text-red-500 mt-4">{message}</p>}
      </div>
    </main>
  );
};

export default HealthDataForm;
