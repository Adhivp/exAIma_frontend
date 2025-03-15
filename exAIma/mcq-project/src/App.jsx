import { useState } from 'react';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

function App() {
  const [selectedOption, setSelectedOption] = useState(null);

  // Sample MCQ Data
  const question = {
    text: 'What is the capital of France?',
    options: [
      { id: 1, text: 'Paris', isCorrect: true },
      { id: 2, text: 'London', isCorrect: false },
      { id: 3, text: 'Berlin', isCorrect: false },
      { id: 4, text: 'Madrid', isCorrect: false },
    ],
  };

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <h1 className="text-2xl font-bold text-green-800 mb-6 text-center tracking-tight">
          Premium MCQ Quiz
        </h1>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: '10%' }} // Adjust this for progress
          ></div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 leading-tight">
            {question.text}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedOption === option.id
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <span className="text-gray-800 font-medium">
                {option.text}
              </span>
              {selectedOption === option.id && (
                <FaCheckCircle className="text-green-500" />
              )}
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          className={`mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
            selectedOption
              ? 'bg-green-600 hover:bg-green-700 shadow-lg'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!selectedOption}
        >
          Next <FaArrowRight className="text-sm" />
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Question 1 of 10
        </p>
      </div>
    </div>
  );
}

export default App;