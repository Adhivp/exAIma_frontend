import { useState, useEffect } from 'react';
import { FaCheckCircle, FaArrowRight, FaLock } from 'react-icons/fa';

function App() {
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [examCompleted, setExamCompleted] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);

  // Sample MCQ Questions
  const questions = [
    {
      text: 'What is the capital of France?',
      options: [
        { id: 1, text: 'Paris', isCorrect: true },
        { id: 2, text: 'London', isCorrect: false },
        { id: 3, text: 'Berlin', isCorrect: false },
        { id: 4, text: 'Madrid', isCorrect: false },
      ],
    },
    {
      text: 'Which planet is known as the Red Planet?',
      options: [
        { id: 1, text: 'Earth', isCorrect: false },
        { id: 2, text: 'Mars', isCorrect: true },
        { id: 3, text: 'Jupiter', isCorrect: false },
        { id: 4, text: 'Venus', isCorrect: false },
      ],
    },
    {
      text: 'What is 2 + 2?',
      options: [
        { id: 1, text: '3', isCorrect: false },
        { id: 2, text: '4', isCorrect: true },
        { id: 3, text: '5', isCorrect: false },
        { id: 4, text: '6', isCorrect: false },
      ],
    },
  ];

  // Start Exam in Full-Screen Mode
  const startExam = () => {
    setExamStarted(true);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  // Handle Option Selection
  const handleOptionClick = (optionId) => {
    if (!selectedOption) {
      setSelectedOption(optionId);
      const selected = questions[currentQuestionIndex].options.find(
        (opt) => opt.id === optionId
      );
      if (selected.isCorrect) {
        setScore(score + 1);
      }
    }
  };

  // Move to Next Question
  const handleNextQuestion = () => {
    if (selectedOption) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        setExamCompleted(true);
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
    }
  };

  // Detect Tab Switching or Focus Loss
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (examStarted && document.hidden) {
        setTabSwitchWarning(true);
      }
    };

    const handleBlur = () => {
      if (examStarted) {
        setTabSwitchWarning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [examStarted]);

  // Reset Warning
  const clearWarning = () => {
    setTabSwitchWarning(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      {!examStarted ? (
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-2xl font-bold text-green-800 mb-6 text-center tracking-tight">
            Welcome to MCQ Exam
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Click below to start your exam in full-screen mode.
          </p>
          <button
            onClick={startExam}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-all duration-300 shadow-lg"
          >
            Start Exam <FaArrowRight />
          </button>
        </div>
      ) : examCompleted ? (
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-2xl font-bold text-green-800 mb-6 text-center tracking-tight">
            Exam Completed
          </h1>
          <p className="text-gray-800 text-center mb-6">
            Your Score: {score} / {questions.length}
          </p>
          <button
            onClick={() => {
              setExamStarted(false);
              setCurrentQuestionIndex(0);
              setScore(0);
              setExamCompleted(false);
              setSelectedOption(null);
            }}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-all duration-300 shadow-lg"
          >
            Restart Exam <FaArrowRight />
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <h1 className="text-2xl font-bold text-green-800 mb-6 text-center tracking-tight">
            Premium MCQ Exam
          </h1>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">
              {questions[currentQuestionIndex].text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {questions[currentQuestionIndex].options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedOption === option.id
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <span className="text-gray-800 font-medium">{option.text}</span>
                {selectedOption === option.id && (
                  <FaCheckCircle className="text-green-500" />
                )}
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextQuestion}
            className={`mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              selectedOption
                ? 'bg-green-600 hover:bg-green-700 shadow-lg'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedOption}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'} <FaArrowRight className="text-sm" />
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>

          {/* Tab Switch Warning */}
          {tabSwitchWarning && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm text-center">
                <FaLock className="text-red-500 text-3xl mx-auto mb-4" />
                <p className="text-gray-800 font-semibold mb-4">
                  Warning: Tab switching detected! Stay on this page to continue the exam.
                </p>
                <button
                  onClick={clearWarning}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                  Okay
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;