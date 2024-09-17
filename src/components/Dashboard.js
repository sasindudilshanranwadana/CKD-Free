import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Loading from './Loading';
import kidneyIcon from '../assets/kidneys.png';
import kidneyBlackIcon from '../assets/kidneys-black.png';
import logoutIcon from '../assets/logout-50.png';

const facts = [
  "Processed foods high in sodium can be harmful if you suffer from kidney disease, so try to limit your intake as much as possible.",
  // ... Other facts
  "Managing blood sugar and blood pressure is crucial for kidney health."
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [hasCompletedHealthData, setHasCompletedHealthData] = useState(false);
  const [userName, setUserName] = useState('User');
  const [streak, setStreak] = useState(0);
  const [reviewDates, setReviewDates] = useState([]);
  const [reviewCompletedToday, setReviewCompletedToday] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [fact, setFact] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkHealthDataCompletion(user.uid);
        checkReviewCompletion(user.uid);
      } else {
        navigate('/signin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (reviewCompletedToday) {
      const interval = setInterval(() => {
        const now = new Date();
        const lastReviewTime = new Date(localStorage.getItem('lastReviewTime'));
        if (!isNaN(lastReviewTime)) {
          const nextReviewTime = new Date(lastReviewTime.getTime() + 24 * 60 * 60 * 1000);
          const diff = nextReviewTime - now;
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft('');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [reviewCompletedToday]);

  const checkHealthDataCompletion = async (uid) => {
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      setHasCompletedHealthData(userData.hasCompletedHealthData);
      setUserName(userData.firstName || 'User');
      calculateStreak(userData.reviewDates || []);
      setReviewDates(userData.reviewDates || []);
    }
    setLoading(false);
  };

  const calculateStreak = (dates) => {
    if (dates.length === 0) {
      setStreak(0);
      return;
    }

    dates.sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 1;
    let previousDate = new Date(dates[0]);

    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      const diffTime = Math.abs(previousDate - currentDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        previousDate = currentDate;
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  };

  const checkReviewCompletion = async (uid) => {
    const today = new Date().toISOString().split('T')[0];
    const reviewQuery = query(
      collection(db, 'dailyReviews'),
      where('userId', '==', uid),
      where('date', '==', today)
    );

    const querySnapshot = await getDocs(reviewQuery);
    if (!querySnapshot.empty) {
      const reviewData = querySnapshot.docs[0].data();
      localStorage.setItem('lastReviewTime', reviewData.completionTime);
      setReviewCompletedToday(true);
    }
  };

  const getLastFiveDays = () => {
    const dates = [];
    const today = new Date();
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * facts.length);
    return facts[randomIndex];
  };

  useEffect(() => {
    setFact(getRandomFact());
  }, []);

  const lastFiveDays = getLastFiveDays();

  if (loading) return <Loading />;

  return (
    <main className="flex flex-col items-center min-h-screen w-full text-base text-gray-500 bg-white p-4 mt-8"> {/* Added 'mt-8' for top margin */}
      <div className="flex flex-col items-center w-full max-w-md space-y-8">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Hello, {userName}.</h1>
          <img src={logoutIcon} alt="Logout" className="w-8 h-8 cursor-pointer" onClick={() => auth.signOut()} />
        </div>
        <div className="w-full flex justify-between items-center space-x-4">
          {lastFiveDays.map(date => {
            const dateString = date.toISOString().split('T')[0];
            const completed = reviewDates.includes(dateString);
            return (
              <div key={dateString} className="flex flex-col items-center">
                <img src={completed ? kidneyIcon : kidneyBlackIcon} alt="kidney icon" className="w-10 h-10" />
                <span className="text-sm">{`${date.getMonth() + 1}/${date.getDate()}`}</span>
              </div>
            );
          })}
        </div>
        <p className="text-center text-lg">You’re on a {streak} day streak, keep it up!</p>
        {/* Center alignment with increased width */}
        <div className="w-full lg:flex lg:flex-col lg:items-center space-y-4">
          <button
            className={`w-full lg:w-2/3 py-12 lg:py-4 rounded-lg ${
              reviewCompletedToday ? 'bg-gray-400' : 'bg-yellow-500'
            } text-white font-medium text-lg`}
            onClick={() => {
              if (reviewCompletedToday) {
                alert(`You have already completed the morning review today. Next review in: ${timeLeft}`);
              } else {
                navigate('/dashboard/morning-review');
              }
            }}
            disabled={reviewCompletedToday}
          >
            {reviewCompletedToday ? `Next review in: ${timeLeft}` : 'Complete Morning Review'}
          </button>
          <button
            className="w-full lg:w-2/3 py-12 lg:py-4 rounded-lg bg-yellow-500 text-white font-medium text-lg"
            onClick={() => navigate('/dashboard/clinical-test-results')}
          >
            Submit Clinical Test Results
          </button>
        </div>
        {!hasCompletedHealthData && (
          <button
            className="w-full py-4 rounded-lg bg-gray-300 text-black font-medium text-lg mt-4"
            onClick={() => navigate('/dashboard/healthdata-form')}
          >
            Update Health Information
          </button>
        )}
        <div className="w-full p-4 bg-gray-200 rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Did You Know...</h3>
          <p className="text-sm">{fact}</p>
        </div>
        <div className="w-full text-center text-lg space-y-4 mt-6">
          <p>Need some help? Contact a professional.</p>
          <div className="flex justify-between space-x-4">
            <button
              className="w-1/2 py-3 rounded-lg bg-gray-300 text-black font-medium"
              onClick={() => navigate('/dashboard/qna')}
            >
              Ask Question
            </button>
            <button
              className="w-1/2 py-3 rounded-lg bg-gray-300 text-black font-medium relative"
              onClick={() => navigate('/dashboard/recent-questions')}
            >
              Recent Questions
              <span className="absolute top-0 right-2 bg-yellow-500 text-white text-xs rounded-full px-1">1</span>
            </button>
          </div>
          <button
            className="w-full mt-4 py-3 rounded-lg bg-gray-300 text-black font-medium"
            onClick={() => navigate('/dashboard/settings')}
          >
            Settings
          </button>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
