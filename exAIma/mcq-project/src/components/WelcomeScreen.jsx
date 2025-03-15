import { FaArrowRight, FaCode, FaRegClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

function WelcomeScreen({ startExam }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
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
  );
}

export default WelcomeScreen;