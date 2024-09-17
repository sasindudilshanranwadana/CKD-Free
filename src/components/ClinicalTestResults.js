import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/back.png';

const ClinicalTestResults = () => {
  const [egfr, setEgfr] = useState('');
  const [acr, setAcr] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [testDate, setTestDate] = useState(''); // Added state for the test date
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

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
        <h1 className="text-2xl font-semibold mb-6">Clinical Test Results</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 italic text-gray-600">
              Estimated Glomerular Filtration Rate (eGFR)
            </label>
            <input
              type="text"
              placeholder="Enter eGFR here"
              className="w-full p-2 bg-gray-200 rounded-full"
              value={egfr}
              onChange={(e) => setEgfr(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 italic text-gray-600">
              Urine Albumin-Creatinine Ratio (Urine ACR)
            </label>
            <input
              type="text"
              placeholder="Enter urine ACR here"
              className="w-full p-2 bg-gray-200 rounded-full"
              value={acr}
              onChange={(e) => setAcr(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 italic text-gray-600">
              Blood Pressure
            </label>
            <input
              type="text"
              placeholder="Enter blood pressure here"
              className="w-full p-2 bg-gray-200 rounded-full"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 italic text-gray-600">
              Date of Test Completion
            </label>
            <input
              type="date" // Changed input type to date
              className="w-full p-2 bg-gray-200 rounded-full"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)} // Added onChange handler
            />
          </div>
          <button type="submit" className="w-full py-3 mt-4 bg-green-500 text-white rounded-full text-lg font-semibold">
            Submit Answers
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClinicalTestResults;
