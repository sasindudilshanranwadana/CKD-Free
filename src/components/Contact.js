import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { addDoc, collection, getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/Contact.css';

const Contact = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

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

      await addDoc(collection(db, 'messages'), {
        subject,
        message,
        userName,
        userId: user.uid,
        timestamp: new Date(),
      });
      setSuccess(true);
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Error adding document: ', err);
      setError('Error sending message. Please try again.');
    }
  };

  return (
    <div className="contact-container">
      <h2>Contact</h2>
      {success && <p className="success">Message Successfully Sent</p>}
      {error && <p className="error">{error}</p>}
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
