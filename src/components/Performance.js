import React, { useState, useEffect } from 'react';
import '../styles/Performance.css';

const Performance = () => {
  const [data, setData] = useState({
    eGFR: [],
    urineACR: [],
    bloodPressure: [],
  });

  useEffect(() => {
    // Simulate fetching data from an API or database
    // Replace this with actual data fetching logic
    setData({
      eGFR: [/* data points */],
      urineACR: [/* data points */],
      bloodPressure: [/* data points */],
    });
  }, []);

  const renderFilterButtons = (title) => {
    if (data[title].length > 0) {
      return (
        <div className="filter-buttons">
          <button>Weekly</button>
          <button>Monthly</button>
        </div>
      );
    }
    return null;
  };

  const renderChart = (title, displayName) => {
    return (
      <div className="chart">
        <h3>{displayName}</h3>
        {renderFilterButtons(title)}
        {data[title].length > 0 ? (
          <p>Chart displaying {displayName} data</p>
        ) : (
          <p>No Data</p>
        )}
      </div>
    );
  };

  return (
    <div className="performance-container">
      <h2>Performance</h2>
      {renderChart('eGFR', 'Estimated Glomerular Filtration Rate (eGFR)')}
      {renderChart('urineACR', 'Urine Albumin-Creatinine Ratio (Urine ACR)')}
      {renderChart('bloodPressure', 'Blood Pressure')}
    </div>
  );
};

export default Performance;
