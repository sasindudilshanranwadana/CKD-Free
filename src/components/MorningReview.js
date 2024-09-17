import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/back.png';

const MorningReview = () => {
  const navigate = useNavigate();
  const [alcoholDrinks, setAlcoholDrinks] = useState('');
  const [alcoholType, setAlcoholType] = useState('');
  const [foodHealthiness, setFoodHealthiness] = useState(null);
  const [cigarettes, setCigarettes] = useState('');
  const [exercise, setExercise] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the form data to Firebase
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-4 bg-white mt-8">
      <div className="w-full max-w-md mt-8"> {/* Added mt-8 for top margin */}
        <div className="flex items-center mb-4">
          <img
            src={backIcon}
            alt="Back"
            className="w-6 h-6 cursor-pointer mr-2"
            onClick={() => navigate(-1)}
          />
        </div>
        <h1 className="text-2xl font-semibold mb-6">Daily Review</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Approximately how many standard drinks of alcohol did you drink?
            </label>
            <div className="flex justify-between items-center bg-gray-200 rounded-full p-0.5 h-10 "> {/* Fixed height */}
              {['0', '1-2', '3-4', '5-6', '7+'].map((drink, index) => (
                <button
                  type="button"
                  key={index}
                  className={`flex-1 py-2 text-sm rounded-full -mt-0.5
                     ${
                    alcoholDrinks === drink ? 'bg-gray-500 text-white' : 'bg-gray-200'
                  } hover:bg-gray-300 transition duration-200`}
                  onClick={() => setAlcoholDrinks(drink)}
                >
                  {drink}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              What was the main type of alcohol you were drinking?
            </label>
            <input
              type="text"
              placeholder="Enter name of alcohol here"
              className="w-full p-2 bg-gray-200 rounded-full"
              value={alcoholType}
              onChange={(e) => setAlcoholType(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              How would you rate the healthiness of the food you ate?
            </label>
            <div className="flex justify-between items-center bg-gray-200 rounded-full p-0.5 h-10.5"> {/* Fixed height */}
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  type="button"
                  key={num}
                  className={`flex-1 py-2 text-sm rounded-full -mt-0.5 ${
                    foodHealthiness === num ? 'bg-gray-500 text-white' : 'bg-gray-200'
                  } hover:bg-gray-300 transition duration-200`}
                  onClick={() => setFoodHealthiness(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              How many cigarettes did you smoke today?
            </label>
            <div className="flex justify-between items-center bg-gray-200 rounded-full p-0.5 h-10.5 "> {/* Fixed height */}
              {['0', '1-5', '6-10', '11-15', '15+'].map((cig, index) => (
                <button
                  type="button"
                  key={index}
                  className={`flex-1 py-3 text-sm rounded-full -mt-0.5 p-2 ${
                    cigarettes === cig ? 'bg-gray-500 text-white' : 'bg-gray-200'
                  } hover:bg-gray-300 transition duration-200`}
                  onClick={() => setCigarettes(cig)}
                >
                  {cig}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Did you perform at least 40 minutes of light exercise? This includes walking.
            </label>
            <div className="flex justify-between items-center bg-gray-200 rounded-full p-0.5 h-10.5"> {/* Fixed height */}
              {['Yes', 'No'].map((option, index) => (
                <button
                  type="button"
                  key={index}
                  className={`flex-1 py-2 text-sm rounded-full -mt-0.5 ${
                    exercise === option.toLowerCase() ? 'bg-gray-500 text-white' : 'bg-gray-200'
                  } hover:bg-gray-300 transition duration-200`}
                  onClick={() => setExercise(option.toLowerCase())}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full py-3 mt-4 bg-green-500 text-white rounded-full text-lg font-semibold">
            Submit Answers
          </button>
        </form>
      </div>
    </div>
  );
};

export default MorningReview;
