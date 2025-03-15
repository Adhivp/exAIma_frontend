import { FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

function TabSwitchWarning({ clearWarning }) {
  return (
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Warning: Exam Integrity</h2>
        <p className="text-gray-600 mb-6">
          You’ve navigated away from the exam window. This activity is monitored and may be flagged.
          Please stay focused on your exam.
        </p>
        <button
          onClick={clearWarning}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-md"
        >
          Return to Exam
        </button>
      </motion.div>
    </motion.div>
  );
}

export default TabSwitchWarning;