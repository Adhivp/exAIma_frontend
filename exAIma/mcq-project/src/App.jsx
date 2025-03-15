import { useState, useEffect } from 'react';
import { FaCheckCircle, FaArrowRight, FaLock, FaRegClock, FaChevronRight, FaCode, FaTrophy } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [examCompleted, setExamCompleted] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [answers, setAnswers] = useState(Array(10).fill(null));

  // 10 Python-Related Questions
  const questions = [
    {
      text: 'What is the output of print(2 ** 3)?',
      options: [
        { id: 1, text: '6', isCorrect: false },
        { id: 2, text: '8', isCorrect: true },
        { id: 3, text: '9', isCorrect: false },
        { id: 4, text: '5', isCorrect: false },
      ],
      explanation: 'The ** operator in Python represents exponentiation. 2 ** 3 = 2³ = 8.'
    },
    {
      text: 'Which keyword is used to define a function in Python?',
      options: [
        { id: 1, text: 'func', isCorrect: false },
        { id: 2, text: 'def', isCorrect: true },
        { id: 3, text: 'function', isCorrect: false },
        { id: 4, text: 'define', isCorrect: false },
      ],
      explanation: 'In Python, the "def" keyword is used to define a function.'
    },
    {
      text: 'What is the correct file extension for Python files?',
      options: [
        { id: 1, text: '.pyth', isCorrect: false },
        { id: 2, text: '.pt', isCorrect: false },
        { id: 3, text: '.py', isCorrect: true },
        { id: 4, text: '.python', isCorrect: false },
      ],
      explanation: 'Python files use the .py extension.'
    },
    {
      text: 'Which of these is NOT a Python data type?',
      options: [
        { id: 1, text: 'List', isCorrect: false },
        { id: 2, text: 'Tuple', isCorrect: false },
        { id: 3, text: 'ArrayList', isCorrect: true },
        { id: 4, text: 'Dictionary', isCorrect: false },
      ],
      explanation: 'ArrayList is a Java data structure, not a Python data type. Python has lists, tuples, dictionaries, and sets among its built-in collection types.'
    },
    {
      text: 'How do you create a comment in Python?',
      options: [
        { id: 1, text: '//', isCorrect: false },
        { id: 2, text: '#', isCorrect: true },
        { id: 3, text: '/*', isCorrect: false },
        { id: 4, text: '--', isCorrect: false },
      ],
      explanation: 'Python uses the # symbol for single-line comments.'
    },
    {
      text: 'What does the len() function do?',
      options: [
        { id: 1, text: 'Returns the length of an object', isCorrect: true },
        { id: 2, text: 'Adds an element to a list', isCorrect: false },
        { id: 3, text: 'Removes an element', isCorrect: false },
        { id: 4, text: 'Checks a condition', isCorrect: false },
      ],
      explanation: 'The len() function returns the number of items in an object like a string, list, or tuple.'
    },
    {
      text: 'Which operator is used for string concatenation in Python?',
      options: [
        { id: 1, text: '+', isCorrect: true },
        { id: 2, text: '&', isCorrect: false },
        { id: 3, text: '||', isCorrect: false },
        { id: 4, text: '*', isCorrect: false },
      ],
      explanation: 'Python uses the + operator to concatenate strings.'
    },
    {
      text: 'What is the output of print(type([]))?',
      options: [
        { id: 1, text: '<class "str">', isCorrect: false },
        { id: 2, text: '<class "list">', isCorrect: true },
        { id: 3, text: '<class "tuple">', isCorrect: false },
        { id: 4, text: '<class "dict">', isCorrect: false },
      ],
      explanation: 'The empty square brackets [] create an empty list, so type([]) returns <class "list">.'
    },
    {
      text: 'Which method adds an item to the end of a list?',
      options: [
        { id: 1, text: 'insert()', isCorrect: false },
        { id: 2, text: 'append()', isCorrect: true },
        { id: 3, text: 'add()', isCorrect: false },
        { id: 4, text: 'push()', isCorrect: false },
      ],
      explanation: 'The append() method adds an item to the end of a list.'
    },
    {
      text: 'What is Python primarily known for?',
      options: [
        { id: 1, text: 'Game development', isCorrect: false },
        { id: 2, text: 'Web development', isCorrect: false },
        { id: 3, text: 'Ease of use and readability', isCorrect: true },
        { id: 4, text: 'Low-level system programming', isCorrect: false },
      ],
      explanation: 'Python is famous for its simple syntax, readability, and ease of use.'
    },
  ];

  // Timer functionality
  useEffect(() => {
    let timer;
    
    if (examStarted && !examCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setExamCompleted(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [examStarted, examCompleted, timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Exam in Full-Screen Mode
  const startExam = () => {
    setExamStarted(true);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log("Error attempting to enable fullscreen:", err);
      });
    }
  };

  // Handle Option Selection
  const handleOptionClick = (optionId) => {
    if (!selectedOption) {
      setSelectedOption(optionId);
      const selected = questions[currentQuestionIndex].options.find(
        (opt) => opt.id === optionId
      );
      
      // Update answers array
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = optionId;
      setAnswers(newAnswers);
      
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
        setSelectedOption(answers[currentQuestionIndex + 1]);
      } else {
        setExamCompleted(true);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(err => {
            console.log("Error attempting to exit fullscreen:", err);
          });
        }
      }
    }
  };

  // Move to Previous Question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1]);
    }
  };

  // Jump to specific question
  const jumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(answers[index]);
  };

  // Detect Tab Switching or Focus Loss
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (examStarted && !examCompleted && document.hidden) {
        setTabSwitchWarning(true);
      }
    };

    const handleBlur = () => {
      if (examStarted && !examCompleted) {
        setTabSwitchWarning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [examStarted, examCompleted]);

  // Reset Warning
  const clearWarning = () => {
    setTabSwitchWarning(false);
  };

  // Calculate performance level
  const getPerformanceLevel = () => {
    const percentage = (score / questions.length) * 100;
    
    if (percentage >= 90) return { text: "Excellent", color: "text-green-500" };
    if (percentage >= 75) return { text: "Good", color: "text-blue-500" };
    if (percentage >= 60) return { text: "Average", color: "text-yellow-500" };
    return { text: "Needs Improvement", color: "text-red-500" };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <AnimatePresence mode="wait">
        {!examStarted ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
          >
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-green-100 rounded-full opacity-50"></div>
            <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-green-100 rounded-full opacity-50"></div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <FaCode className="text-white text-4xl" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-green-800 mb-6 text-center tracking-tight"
            >
              Python MCQ Challenge
            </motion.h1>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-gray-600 text-center mb-6">
                Test your Python knowledge with 10 challenging questions!
              </p>
              
              <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-100">
                <div className="flex items-center text-green-800 mb-2">
                  <FaRegClock className="mr-2" />
                  <span className="font-medium">Time Limit: 10 minutes</span>
                </div>
                <div className="text-sm text-gray-600">
                  Answer all questions before time runs out!
                </div>
              </div>
              
              <button
                onClick={startExam}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                Start Challenge <FaArrowRight />
              </button>
            </motion.div>
          </motion.div>
        ) : examCompleted ? (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl"
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, type: "spring" }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <FaTrophy className="text-white text-4xl" />
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-green-800 mb-2 tracking-tight"
              >
                Challenge Complete!
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600"
              >
                {timeLeft === 0 ? "Time's up!" : "You've completed all questions."}
              </motion.p>
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}transition={{ delay: 0.4 }}
              className="bg-green-50 rounded-xl p-6 mb-8 border border-green-100"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-green-800">Your Results</h2>
                <div className="flex items-center justify-center mt-4">
                  <div className="w-32 h-32 rounded-full flex items-center justify-center border-8 border-green-200 relative">
                    <span className="text-3xl font-bold text-green-700">{score}/{questions.length}</span>
                    <motion.div 
                      className="absolute inset-0 rounded-full"
                      style={{ 
                        background: `conic-gradient(#16a34a ${(score/questions.length)*100}%, transparent 0)`,
                        maskImage: 'radial-gradient(transparent 60%, #000 62%)'
                      }}
                    />
                  </div>
                </div>
                <p className={`text-lg font-semibold mt-4 ${getPerformanceLevel().color}`}>
                  {getPerformanceLevel().text}
                </p>
                <p className="text-gray-600 mt-2">
                  {score === questions.length 
                    ? "Perfect score! Excellent work!" 
                    : score >= questions.length * 0.7 
                      ? "Good job! You have a strong understanding of Python basics."
                      : "Keep practicing! You're on your way to mastering Python."}
                </p>
              </div>
              
              <div className="border-t border-green-200 pt-4">
                <h3 className="font-medium text-green-800 mb-2">Time Used:</h3>
                <p className="text-gray-700">{10 - Math.ceil(timeLeft/60)} minutes {timeLeft % 60 === 0 ? "" : (60 - (timeLeft % 60)) + " seconds"}</p>
              </div>
            </motion.div>
            
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setExamStarted(false);
                  setCurrentQuestionIndex(0);
                  setScore(0);
                  setExamCompleted(false);
                  setSelectedOption(null);
                  setTimeLeft(10 * 60);
                  setAnswers(Array(10).fill(null));
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
              >
                Try Again <FaArrowRight />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Review answers functionality could be added here
                  setExamStarted(false);
                }}
                className="flex-1 bg-white border-2 border-green-500 text-green-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-50 transition-all duration-300 shadow-md"
              >
                Back to Home
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="exam"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl flex relative"
          >
            {/* Main Content */}
            <div className="flex-1 pr-8">
              {/* Header with Timer */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-green-800 tracking-tight">
                  Python MCQ Challenge
                </h1>
                <div className="flex items-center">
                  <div className={`flex items-center p-2 rounded-lg ${
                    timeLeft < 60 ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-700'
                  }`}>
                    <FaRegClock className="mr-2" />
                    <span className="font-bold">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Question Container */}
              <div className="mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-sm font-medium text-green-600 block mb-2">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                      {questions[currentQuestionIndex].text}
                    </h2>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Options */}
              <div className="space-y-4 mb-8">
                <AnimatePresence>
                  {questions[currentQuestionIndex].options.map((option, idx) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionClick(option.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedOption === option.id
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          selectedOption === option.id
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-gray-800 font-medium">{option.text}</span>
                      </div>
                      
                      {selectedOption === option.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, type: "spring" }}
                        >
                          <FaCheckCircle className="text-green-500" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevQuestion}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    currentQuestionIndex > 0
                      ? 'bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    selectedOption
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!selectedOption}
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'} <FaChevronRight className="text-sm" />
                </motion.button>
              </div>
            </div>
            
            {/* Question Navigation Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-64 bg-gradient-to-b from-green-50 to-white rounded-xl shadow-inner border border-green-100 p-6"
            >
              <h3 className="text-green-800 font-semibold mb-6 text-center">Question Navigator</h3>
              
              <div className="grid grid-cols-3 gap-3">
                {questions.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => jumpToQuestion(index)}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium shadow-sm transition-all ${
                      index === currentQuestionIndex
                        ? 'bg-green-500 text-white shadow-md ring-2 ring-green-300 ring-offset-2'
                        : answers[index] !== null
                          ? 'bg-green-200 text-green-800'
                          : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {index + 1}
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">Completed:</div>
                  <div className="text-sm font-medium text-green-700">
                    {answers.filter(a => a !== null).length}/{questions.length}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-green-500 h-2 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(answers.filter(a => a !== null).length / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-green-100">
                <div className="text-sm text-gray-600 mb-2">Legend:</div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
                    <span className="text-xs text-gray-600">Current Question</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-200 rounded-sm mr-2"></div>
                    <span className="text-xs text-gray-600">Answered</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-white border border-gray-200 rounded-sm mr-2"></div>
                    <span className="text-xs text-gray-600">Unanswered</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Switch Warning */}
      <AnimatePresence>
        {tabSwitchWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-xl p-8 max-w-md shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaLock className="text-red-500 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Warning: Exam Integrity
              </h2>
              <p className="text-gray-600 mb-6">
                You've navigated away from the exam window. This activity is monitored and may be flagged. Please stay focused on your exam.
              </p>
              <button
                onClick={clearWarning}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-md"
              >
                Return to Exam
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;