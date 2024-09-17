import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import '../styles/AdminQnA.css';

const AdminQnA = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [reply, setReply] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    const fetchQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, 'questions'));
      const questionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuestions(questionsData);
    };

    fetchQuestions();
  }, []);

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (selectedQuestion) {
      try {
        const questionRef = doc(db, 'questions', selectedQuestion.id);
        await updateDoc(questionRef, { reply });
        setReply('');
        setSelectedQuestion(null);
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    }
  };

  const filteredQuestions = questions.filter((question) =>
    question.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const closePopup = () => {
    setSelectedQuestion(null);
  };

  return (
    <div className="admin-qna-container">
      <h2>User Questions</h2>
      <input
        type="text"
        placeholder="Search by user, email, subject, or description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Subject</th>
            <th>Description</th>
            <th>Email</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentQuestions.map((question) => (
            <tr key={question.id}>
              <td>{question.userName}</td>
              <td>{question.subject}</td>
              <td>{question.description}</td>
              <td>{question.email}</td>
              <td>{new Date(question.timestamp.seconds * 1000).toLocaleString()}</td>
              <td><button className="view-details-button" onClick={() => setSelectedQuestion(question)}>View Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredQuestions.length / questionsPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      {selectedQuestion && (
        <div className="popup" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <table>
              <tbody>
                <tr>
                  <td><strong>From:</strong></td>
                  <td>{selectedQuestion.userName}</td>
                </tr>
                <tr>
                  <td><strong>Subject:</strong></td>
                  <td>{selectedQuestion.subject}</td>
                </tr>
                <tr>
                  <td><strong>Description:</strong></td>
                  <td>{selectedQuestion.description}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>{selectedQuestion.email}</td>
                </tr>
                <tr>
                  <td><strong>Timestamp:</strong></td>
                  <td>{new Date(selectedQuestion.timestamp.seconds * 1000).toLocaleString()}</td>
                </tr>
                {selectedQuestion.reply && (
                  <tr>
                    <td><strong>Reply:</strong></td>
                    <td>{selectedQuestion.reply}</td>
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

export default AdminQnA;
