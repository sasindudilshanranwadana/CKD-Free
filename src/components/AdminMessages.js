import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import '../styles/AdminMessages.css';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    };

    fetchMessages();
  }, []);

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (selectedMessage) {
      try {
        const messageRef = doc(db, 'messages', selectedMessage.id);
        await updateDoc(messageRef, { reply });
        setReply('');
        setSelectedMessage(null);
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    }
  };

  const filteredMessages = messages.filter((message) =>
    message.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const closePopup = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="admin-messages-container">
      <h2>User Messages</h2>
      <input
        type="text"
        placeholder="Search by user, email or message"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Message</th>
            <th>Email</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentMessages.map((message) => (
            <tr key={message.id}>
              <td>{message.userName}</td>
              <td>{message.message}</td>
              <td>{message.email}</td>
              <td>{new Date(message.timestamp.seconds * 1000).toLocaleString()}</td>
              <td><button className="view-details-button" onClick={() => setSelectedMessage(message)}>View Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredMessages.length / messagesPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      {selectedMessage && (
        <div className="popup" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <table>
              <tbody>
                <tr>
                  <td><strong>From:</strong></td>
                  <td>{selectedMessage.userName}</td>
                </tr>
                <tr>
                  <td><strong>Message:</strong></td>
                  <td>{selectedMessage.message}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>{selectedMessage.email}</td>
                </tr>
                <tr>
                  <td><strong>Timestamp:</strong></td>
                  <td>{new Date(selectedMessage.timestamp.seconds * 1000).toLocaleString()}</td>
                </tr>
                {selectedMessage.reply && (
                  <tr>
                    <td><strong>Reply:</strong></td>
                    <td>{selectedMessage.reply}</td>
                  </tr>
                )}
              </tbody>
            </table>
            <form onSubmit={handleReplySubmit} className="reply-form">
              <textarea
                placeholder="Write your reply"
                value={reply}
                onChange={handleReplyChange}
                required
              />
              <button type="submit">Send Reply</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
