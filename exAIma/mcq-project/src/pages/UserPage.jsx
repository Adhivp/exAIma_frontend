import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function UserPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Guest' };
  const accessToken = localStorage.getItem('access_token');
  const tokenType = localStorage.getItem('token_type');
  const exams = [
    { id: 1, title: 'Python Basics', questionsCount: 10, duration: '10 mins' },
    { id: 2, title: 'Python Advanced', questionsCount: 15, duration: '15 mins' },
    // Add more exams as needed
  ];

  const handleStartExam = (examId) => {
    navigate(`/exam?examId=${examId}`);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://4.240.76.3:8000/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `${tokenType} ${accessToken}`,
        },
      });

      if (response.ok) {
        // Successful logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        navigate('/');
      } else {
        // Even if the API fails, clear local storage and redirect
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        navigate('/');
      }
    } catch (error) {
      // Handle network errors by clearing local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Welcome, {user.username}!</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>
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