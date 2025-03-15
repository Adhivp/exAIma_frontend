import { FaArrowRight, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';

function ResultScreen({ score, timeLeft, resetExam, totalQuestions }) {
  const getPerformanceLevel = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return { text: 'Excellent', color: 'text-green-500' };
    if (percentage >= 75) return { text: 'Good', color: 'text-blue-500' };
    if (percentage >= 60) return { text: 'Average', color: 'text-yellow-500' };
    return { text: 'Needs Improvement', color: 'text-red-500' };
  };

  return (
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
          transition={{ duration: 0.7, type: 'spring' }}
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
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-green-50 rounded-xl p-6 mb-8 border border-green-100"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">Your Results</h2>
          <div className="flex items-center justify-center mt-4">
            <div className="w-32 h-32 rounded-full flex items-center justify-center border-8 border-green-200 relative">
              <span className="text-3xl font-bold text-green-700">
                {score}/{totalQuestions}
              </span>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#16a34a ${(score / totalQuestions) * 100}%, transparent 0)`,
                  maskImage: 'radial-gradient(transparent 60%, #000 62%)',
                }}
              />
            </div>
          </div>
          <p className={`text-lg font-semibold mt-4 ${getPerformanceLevel().color}`}>
            {getPerformanceLevel().text}
          </p>
          <p className="text-gray-600 mt-2">
            {score === totalQuestions
              ? 'Perfect score! Excellent work!'
              : score >= totalQuestions * 0.7
              ? 'Good job! You have a strong understanding of Python basics.'
              : 'Keep practicing! You’re on your way to mastering Python.'}
          </p>
        </div>

        <div className="border-t border-green-200 pt-4">
          <h3 className="font-medium text-green-800 mb-2">Time Used:</h3>
          <p className="text-gray-700">
            {10 - Math.ceil(timeLeft / 60)} minutes{' '}
            {timeLeft % 60 === 0 ? '' : 60 - (timeLeft % 60) + ' seconds'}
          </p>
        </div>
      </motion.div>

      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetExam}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
        >
          Try Again <FaArrowRight />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetExam}
          className="flex-1 bg-white border-2 border-green-500 text-green-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-50 transition-all duration-300 shadow-md"
        >
          Back to Home
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ResultScreen;