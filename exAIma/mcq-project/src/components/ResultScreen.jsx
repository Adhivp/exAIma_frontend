import { FaArrowRight, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';

function ResultScreen({ examResults, timeLeft, resetExam, totalQuestions }) {
  if (!examResults) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-white rounded-2xl shadow-2xl p-8"
      >
        <p className="text-red-500 font-semibold">No results available. Please try again.</p>
      </motion.div>
    );
  }

  const {
    obtained_marks = 0,
    total_marks = totalQuestions,
    percentage = 0,
    correct_answers = 0,
    wrong_answers = 0,
    completed_at = new Date().toISOString(),
    question_results = [],
  } = examResults;

  const getPerformanceLevel = () => {
    if (percentage >= 90) return { text: 'Excellent', color: 'text-green-500' };
    if (percentage >= 75) return { text: 'Good', color: 'text-blue-500' };
    if (percentage >= 60) return { text: 'Average', color: 'text-yellow-500' };
    return { text: 'Needs Improvement', color: 'text-red-500' };
  };

  const totalTime = totalQuestions * 60;
  const timeUsed = totalTime - timeLeft;

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
                {obtained_marks}/{total_marks}
              </span>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#16a34a ${percentage}%, transparent 0)`,
                  maskImage: 'radial-gradient(transparent 60%, #000 62%)',
                }}
              />
            </div>
          </div>
          <p className={`text-lg font-semibold mt-4 ${getPerformanceLevel().color}`}>
            {getPerformanceLevel().text} ({percentage.toFixed(2)}%)
          </p>
          <p className="text-gray-600 mt-2">
            {percentage === 100
              ? 'Perfect score! Excellent work!'
              : percentage >= 70
              ? 'Good job! You have a strong understanding.'
              : 'Keep practicing! You’re on your way to mastering.'}
          </p>
        </div>

        <div className="border-t border-green-200 pt-4">
          <h3 className="font-medium text-green-800 mb-2">Summary:</h3>
          <p className="text-gray-700">
            Correct Answers: <span className="font-semibold text-green-600">{correct_answers}</span>
          </p>
          <p className="text-gray-700">
            Wrong Answers: <span className="font-semibold text-red-600">{wrong_answers}</span>
          </p>
          <p className="text-gray-700">
            Time Used: {Math.floor(timeUsed / 60)} minutes{' '}
            {timeUsed % 60 === 0 ? '' : timeUsed % 60 + ' seconds'}
          </p>
          <p className="text-gray-700">
            Completed At: {new Date(completed_at).toLocaleString()}
          </p>
        </div>

        <div className="border-t border-green-200 pt-4 mt-4">
          <h3 className="font-medium text-green-800 mb-2">Question Results:</h3>
          <div className="space-y-2">
            {Array.isArray(question_results) &&
              question_results.map((result, index) => (
                <div key={result.question_id || index} className="text-gray-700">
                  <p>
                    <span className="font-semibold">Question {index + 1}:</span>{' '}
                    {result.question_text || 'Question text unavailable'}
                  </p>
                  <p>
                    Your Answer:{' '}
                    <span className="font-semibold">
                      {result.selected_option || 'Not answered'}
                    </span>
                  </p>
                  <p>
                    Correct Answer:{' '}
                    <span className="font-semibold">{result.correct_option || 'N/A'}</span>
                  </p>
                  <p>
                    Status:{' '}
                    <span className={result.is_correct ? 'text-green-600' : 'text-red-600'}>
                      {result.is_correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </p>
                </div>
              ))}
          </div>
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