import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function UserPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };
  const exams = [
    { id: 1, title: 'Python Basics', questionsCount: 10, duration: '10 mins' },
    { id: 2, title: 'Python Advanced', questionsCount: 15, duration: '15 mins' },
    // Add more exams as needed
  ];

  const handleStartExam = (examId) => {
    navigate(`/exam?examId=${examId}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Welcome, {user.name}!</h1>
      <p className="text-gray-600 mb-8">Select an exam to start your challenge.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <motion.div
            key={exam.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => handleStartExam(exam.id)}
          >
            <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
            <p className="text-gray-600 mt-2">Questions: {exam.questionsCount}</p>
            <p className="text-gray-600">Duration: {exam.duration}</p>
            <button className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
              Start Exam
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}