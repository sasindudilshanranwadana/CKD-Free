import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import backIcon from '../assets/back.png';

const Settings = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicURL, setProfilePicURL] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setProfilePicURL(data.profilePicURL || '');
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        const updates = { firstName, lastName };
        if (profilePic) {
          const profilePicRef = ref(storage, `profilePictures/${user.uid}`);
          await uploadBytes(profilePicRef, profilePic);
          const profilePicURL = await getDownloadURL(profilePicRef);
          updates.profilePicURL = profilePicURL;
        }
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, updates);
        setMessage('Profile updated successfully.');
      } catch (error) {
        setMessage(error.message);
      }
    }
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  if (loading) return <Loading />;

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
        <h2 className="text-2xl font-semibold mb-6">Settings</h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 italic text-gray-600">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-full lg:w-[450px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 italic text-gray-600">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-full lg:w-[450px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 italic text-gray-600">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="w-full p-2 bg-gray-200 rounded-full lg:w-[450px]"
            />
          </div>
          {profilePicURL && <img src={profilePicURL} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />}
          <button type="submit" className="w-full py-3 bg-green-500 text-white rounded-full text-lg font-semibold">
            Update Profile
          </button>
          {message && <p className="text-center text-sm mt-2">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Settings;
