import { useState, useEffect } from 'react';
import { FaCheckCircle, FaRegClock, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

function ExamScreen({
  currentQuestionIndex,
  selectedOption,
  answers,
  timeLeft,
  handleOptionClick,
  handleNextQuestion,
  handlePrevQuestion,
  jumpToQuestion,
  onSubmit,
  showSubmitModal,
  setShowSubmitModal,
}) {
  const location = useLocation();
  const { state } = location;
  const { examId, questions = [], examName = 'Exam', durationMins = 60 } = state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [localTimeLeft, setLocalTimeLeft] = useState(timeLeft || durationMins * 60);
  const accessToken = localStorage.getItem('access_token');
  const tokenType = localStorage.getItem('token_type');
  const [transformedQuestions, setTransformedQuestions] = useState([]);

  // Transform the API questions into the expected format
  useEffect(() => {
    if (questions.length > 0) {
      const transformed = questions.map((q) => ({
        id: q.id,
        text: q.question_text,
        options: [
          { id: 'a', text: q.option_a, isCorrect: false }, // isCorrect is assumed; adjust if available
          { id: 'b', text: q.option_b, isCorrect: false },
          { id: 'c', text: q.option_c, isCorrect: false },
          { id: 'd', text: q.option_d, isCorrect: false },
        ],
      }));
      setTransformedQuestions(transformed);
      setLoading(false);
    } else {
      // Fetch questions if not provided (fallback)
      const fetchQuestions = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://4.240.76.3:8000/exams/${examId}`, {
            method: 'GET',
            headers: {
              'Authorization': `${tokenType} ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            const transformed = data.questions.map((q) => ({
              id: q.id,
              text: q.question_text,
              options: [
                { id: 'a', text: q.option_a, isCorrect: false },
                { id: 'b', text: q.option_b, isCorrect: false },
                { id: 'c', text: q.option_c, isCorrect: false },
                { id: 'd', text: q.option_d, isCorrect: false },
              ],
            }));
            setTransformedQuestions(transformed);
            const durationMins = data.duration_mins || 60;
            setLocalTimeLeft(durationMins * 60);
          } else if (response.status === 403) {
            setError('Access denied. Please log in again.');
            localStorage.removeItem('access_token');
            localStorage.removeItem('token_type');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            window.location.href = '/';
          } else {
            const errorData = await response.json();
            setError(errorData.detail || `Failed to load exam ${examId}.`);
          }
        } catch (error) {
          setError('Network error. Please check your connection.');
        } finally {
          setLoading(false);
        }
      };

      if (examId && accessToken && tokenType) {
        fetchQuestions();
      } else {
        setError('Authentication required. Please log in.');
        setLoading(false);
        window.location.href = '/';
      }
    }
  }, [examId, questions, tokenType, accessToken]);

  // Timer functionality
  useEffect(() => {
    let timer;
    if (!loading && localTimeLeft > 0) {
      timer = setInterval(() => {
        setLocalTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            onSubmit(); // Auto-submit when time runs out
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loading, localTimeLeft, onSubmit]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl flex items-center justify-center"
      >
        <p className="text-green-800 font-semibold">Loading exam...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl flex items-center justify-center"
      >
        <p className="text-red-500 font-semibold">{error}</p>
      </motion.div>
    );
  }

  if (transformedQuestions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl flex items-center justify-center"
      >
        <p className="text-red-500 font-semibold">No questions available for this exam.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="exam"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl flex relative"
    >
      <div className="flex-1 pr-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-800 tracking-tight">
            {examName} MCQ Challenge
          </h1>
          <div className="flex items-center">
            <div
              className={`flex items-center p-2 rounded-lg ${
                localTimeLeft < 60 ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-700'
              }`}
            >
              <FaRegClock className="mr-2" />
              <span className="font-bold">{formatTime(localTimeLeft)}</span>
            </div>
          </div>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentQuestionIndex + 1) / transformedQuestions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

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
                Question {currentQuestionIndex + 1} of {transformedQuestions.length}
              </span>
              <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                {transformedQuestions[currentQuestionIndex].text}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-4 mb-8">
          <AnimatePresence>
            {transformedQuestions[currentQuestionIndex].options.map((option, idx) => (
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
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      selectedOption === option.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-gray-800 font-medium">{option.text}</span>
                </div>
                {selectedOption === option.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                  >
                    <FaCheckCircle className="text-green-500" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

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
            className="flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
          >
            {currentQuestionIndex < transformedQuestions.length - 1 ? 'Next' : 'Finish'}{' '}
            <FaChevronRight className="text-sm" />
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-64 bg-gradient-to-b from-green-50 to-white rounded-xl shadow-inner border border-green-100 p-6"
      >
        <h3 className="text-green-800 font-semibold mb-6 text-center">Question Navigator</h3>

        <div className="grid grid-cols-3 gap-3">
          {transformedQuestions.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => jumpToQuestion(index)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium shadow-sm transition-all ${
                index === currentQuestionIndex
                  ? 'bg-green-500 text-white shadow-md ring-2 ring-green-300 ring-offset-2'
                  : answers[index] !== null
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-300 text-white border border-gray-200'
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
              {answers.filter((a) => a !== null).length}/{transformedQuestions.length}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-green-500 h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{
                width: `${(answers.filter((a) => a !== null).length / transformedQuestions.length) * 100}%`,
              }}
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
              <div className="w-4 h-4 bg-green-100 rounded-sm mr-2"></div>
              <span className="text-xs text-gray-600">Answered</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-300 border border-gray-200 rounded-sm mr-2"></div>
              <span className="text-xs text-gray-600">Unanswered</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-sm shadow-2xl text-center"
            >
              <h2 className="text-xl font-bold text-green-800 mb-4">Finish Exam?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit your answers and end the exam?
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSubmit}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-300 font-medium"
                >
                  Yes, Submit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSubmitModal(false)}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ExamScreen;