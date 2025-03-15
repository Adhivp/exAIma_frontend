import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SuccessPopup from '../components/SuccessPopup';

export default function UserPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Guest' };
  const accessToken = localStorage.getItem('access_token');
  const tokenType = localStorage.getItem('token_type');
  const [showSuccess, setShowSuccess] = useState(false);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('http://4.240.76.3:8000/exams/', {
          method: 'GET',
          headers: {
            'Authorization': `${tokenType} ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
            // console.log('API Response Body:', data);
          const data = await response.json();
          setExams(data);
        } else if (response.status === 403) {
          setError('Access denied. Please log in again.');
          localStorage.clear();
          navigate('/');
        } else {
          const errorData = await response.json();
          setError(errorData.detail || 'Failed to fetch exams.');
        }
      } catch (error) {
        setError('Network error. Please check your connection.');
        console.error('Fetch exams error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken && tokenType) {
      fetchExams();
    } else {
      setError('Authentication required. Please log in.');
      setLoading(false);
      navigate('/');
    }
  }, [accessToken, tokenType, navigate]);

  const handleStartExam = async (examId) => {
    try {
      const response = await fetch(`http://4.240.76.3:8000/exams/${examId}`, {
        method: 'GET',
        headers: {
          'Authorization': `${tokenType} ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        navigate('/exam', {
          state: {
            examId,
            examName: data.exam_name || 'Exam',
            durationMins: data.duration_mins || 60,
          },
        });
      } else if (response.status === 403) {
        setError('Access denied. Please log in again.');
        localStorage.clear();
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || `Failed to load exam ${examId}.`);
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
      console.error('Start exam error:', error);
    }
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
        localStorage.clear();
        setShowSuccess(true);
      } else {
        localStorage.clear();
        navigate('/');
      }
    } catch (error) {
      localStorage.clear();
      navigate('/');
      console.error('Logout error:', error);
    }
  };

  const handlePopupClose = () => {
    setShowSuccess(false);
    navigate('/');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full min-h-screen bg-gray-100 flex items-center justify-center"
      >
        <p className="text-green-800 font-semibold">Loading...</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Welcome, {user.username}!</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
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
            <h3 className="text-xl font-semibold text-gray-900">{exam.exam_name}</h3>
            <p className="text-gray-600 mt-2">{exam.description || 'No description'}</p>
            <p className="text-gray-600">Questions: {exam.number_of_questions || 0}</p>
            <p className="text-gray-600">Duration: {exam.duration_mins || 60} mins</p>
            <button className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
              Start Exam
            </button>
          </motion.div>
        ))}
      </div>
      {showSuccess && (
        <SuccessPopup
          message="Logout successfully"
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
}