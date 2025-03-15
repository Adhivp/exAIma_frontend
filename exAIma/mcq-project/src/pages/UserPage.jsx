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

  // Fetch exams from API
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
          const data = await response.json();
          setExams(data);
        } else if (response.status === 403) {
          setError('Access denied. Please log in again.');
          // Optionally, clear invalid token and redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('token_type');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('user');
          navigate('/');
        } else {
          const errorData = await response.json();
          setError(errorData.detail || 'Failed to fetch exams. Please try again.');
        }
      } catch (error) {
        setError('Network error. Please check your connection.');
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
        // Navigate to exam page with questions and exam details in state
        navigate('/exam', {
          state: {
            examId,
            questions: data.questions || [],
            examName: data.exam_name,
            durationMins: data.duration_mins,
          },
        });
      } else if (response.status === 403) {
        setError('Access denied. Please log in again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || `Failed to load exam ${examId}.`);
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
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
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        setShowSuccess(true);
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        navigate('/');
      }
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const handlePopupClose = () => {
    setShowSuccess(false);
    navigate('/');
  };

  if (loading) {
    return <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
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
            <p className="text-gray-600 mt-2">{exam.description}</p>
            <p className="text-gray-600">Questions: {exam.number_of_questions}</p>
            <p className="text-gray-600">Duration: {exam.duration_mins} mins</p>
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