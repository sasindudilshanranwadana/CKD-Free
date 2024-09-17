import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/back.png';

const RecentQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'questions'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const questionsList = [];
        querySnapshot.forEach((doc) => {
          questionsList.push(doc.data());
        });
        setQuestions(questionsList);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-4 bg-white mt-8">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-4">
          <img
            src={backIcon}
            alt="Back"
            className="w-6 h-6 cursor-pointer mr-2"
            onClick={() => navigate('/dashboard')}
          />
        </div>
        <h1 className="text-2xl font-semibold mb-4">Recent Questions</h1>
        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={index} className="p-4 bg-gray-200 rounded-lg">
                <h3 className="text-lg font-medium mb-2">{question.subject}</h3>
                <p className="text-sm text-gray-700">{question.description}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No recent questions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentQuestions;
