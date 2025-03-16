// src/components/ExamCount.jsx
import { motion } from 'framer-motion';

const ExamCount = ({ darkMode, totalExams }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`w-64 h-40 p-4 rounded-2xl shadow-lg overflow-hidden border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-green-100'
      } flex flex-col items-center justify-center`}
      whileHover={{
        y: -5,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="h-2 w-full bg-gradient-to-r from-green-400 to-green-600 mb-3" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-8 w-8 text-green-500 mb-2`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        Attended 2
      </p>
    </motion.div>
  );
};

export default ExamCount;