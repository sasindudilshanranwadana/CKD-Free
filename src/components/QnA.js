import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { addDoc, collection, getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/back.png';

const QnA = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    if (!user || !user.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userName = userDoc.data().firstName || 'Anonymous';

      await addDoc(collection(db, 'questions'), {
        subject,
        description,
        userName,
        userId: user.uid,
        timestamp: new Date(),
      });
      setSuccess(true);
      setSubject('');
      setDescription('');
    } catch (err) {
      console.error('Error adding document: ', err);
      setError('Error sending question. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-4 bg-white mt-8">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-4">
          <img
            src={backIcon}
            alt="Back"
            className="w-6 h-6 cursor-pointer mr-2"
            onClick={() => navigate(-1)}
          />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Ask a Professional</h1>
        <p className="text-sm text-gray-500 mb-6">
          Have a question about CKD? Ask a professional clinician through CKDFree.
        </p>
        {success && <p className="text-green-500 mb-4">Question Successfully Sent</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div> 
            <label className="block text-sm font-medium mb-2 italic text-gray-600">Title</label>
            <input
              type="text"
              placeholder="Enter question here"
              className="w-[300px] sm:w-full p-2 bg-gray-200 rounded-full lg:w-[450px]"  // Adjusted width for mobile and larger screens
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 italic text-gray-600">Details</label>
            <textarea
              placeholder="Enter additional details here"
              className="w-[300px] sm:w-full p-2 bg-gray-200 rounded-lg lg:w-[450px]"  // Adjusted width for mobile and larger screens
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
            />
          </div>
          <div className="flex justify-between">
            <button type="submit" className="w-1/2 py-3 bg-green-500 text-white rounded-full text-lg font-semibold mr-2 h-12">
              Submit Question
            </button>
            <button
              type="button"
              className="w-1/2 py-3 bg-gray-300 text-black rounded-full text-lg font-semibold h-12"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QnA;
