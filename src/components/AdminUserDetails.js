import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import '../styles/AdminUserDetails.css';

const AdminUserDetails = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [morningReviews, setMorningReviews] = useState([]);
  const [clinicalTestResults, setClinicalTestResults] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }

      const morningReviewQuery = query(
        collection(db, 'dailyReviews'),
        where('userId', '==', userId)
      );
      const morningReviewSnapshot = await getDocs(morningReviewQuery);
      const morningReviewList = [];
      morningReviewSnapshot.forEach((doc) => {
        morningReviewList.push({ id: doc.id, ...doc.data() });
      });
      setMorningReviews(morningReviewList);

      const clinicalTestQuery = query(
        collection(db, 'clinicalTestResults'),
        where('userId', '==', userId)
      );
      const clinicalTestSnapshot = await getDocs(clinicalTestQuery);
      const clinicalTestList = [];
      clinicalTestSnapshot.forEach((doc) => {
        clinicalTestList.push({ id: doc.id, ...doc.data() });
      });
      setClinicalTestResults(clinicalTestList);

      const healthDataDoc = await getDoc(doc(db, 'healthData', userId));
      if (healthDataDoc.exists()) {
        setHealthData(healthDataDoc.data());
      }
    };

    fetchUserData();
  }, [userId]);

  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleString();
    }
    return '';
  };

  const openPopup = (content) => {
    setPopupContent(content);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupContent(null);
  };

  return (
    <div className="admin-user-details-container">
      <h2>User Details</h2>
      <table className="user-details-table">
        <thead>
          <tr>
            <th>Section</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>User Info</td>
            <td><a href="#" className="view-link" onClick={() => openPopup(userData)}>View Details</a></td>
          </tr>
          <tr>
            <td>Morning Reviews</td>
            <td><a href="#" className="view-link" onClick={() => openPopup(morningReviews)}>View Details</a></td>
          </tr>
          <tr>
            <td>Clinical Test Results</td>
            <td><a href="#" className="view-link" onClick={() => openPopup(clinicalTestResults)}>View Details</a></td>
          </tr>
          <tr>
            <td>Health Data</td>
            <td><a href="#" className="view-link" onClick={() => openPopup(healthData)}>View Details</a></td>
          </tr>
        </tbody>
      </table>

      {showPopup && (
        <div className="popup" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            {popupContent && (
              <div className="vertical-table">
                {Array.isArray(popupContent) ? (
                  popupContent.map((item, index) => (
                    <table key={index} className="user-details-table">
                      <tbody>
                        {Object.entries(item).map(([key, value]) => (
                          <tr key={key}>
                            <td><strong>{key}</strong></td>
                            <td>{key.includes('date') || key.includes('timestamp')
                              ? formatTimestamp(value)
                              : value.toString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ))
                ) : (
                  <table className="user-details-table">
                    <tbody>
                      {Object.entries(popupContent).map(([key, value]) => (
                        <tr key={key}>
                          <td><strong>{key}</strong></td>
                          <td>{key.includes('date') || key.includes('timestamp')
                            ? formatTimestamp(value)
                            : value.toString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetails;
