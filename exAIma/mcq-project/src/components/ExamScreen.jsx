import { FaCheckCircle, FaRegClock, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function ExamScreen({
  questions,
  currentQuestionIndex,
  selectedOption,
  answers,
  timeLeft,
  handleOptionClick,
  handleNextQuestion,
  handlePrevQuestion,
  jumpToQuestion,
}) {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-800 tracking-tight">
            Python MCQ Challenge
          </h1>
          <div className="flex items-center">
            <div
              className={`flex items-center p-2 rounded-lg ${
                timeLeft < 60 ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-700'
              }`}
            >
              <FaRegClock className="mr-2" />
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
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
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                {questions[currentQuestionIndex].text}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

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
            className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
              selectedOption
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedOption}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}{' '}
            <FaChevronRight className="text-sm" />
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
              {answers.filter((a) => a !== null).length}/{questions.length}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-green-500 h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{
                width: `${(answers.filter((a) => a !== null).length / questions.length) * 100}%`,
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
  );
}

export default ExamScreen;