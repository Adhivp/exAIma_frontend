import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Ensure motion is imported
import { useLocation, useNavigate } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import ExamScreen from './components/ExamScreen';
import ResultScreen from './components/ResultScreen';
import TabSwitchWarning from './components/TabSwitchWarning';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { examId, examName = 'Exam', durationMins = 60 } = state || {};
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [examCompleted, setExamCompleted] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationMins * 60);
  const [answers, setAnswers] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [transformedQuestions, setTransformedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [examResults, setExamResults] = useState(null);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      const accessToken = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type');
      if (!accessToken || !tokenType || !examId) {
        setError('Authentication required or invalid exam ID. Please log in.');
        setLoading(false);
        navigate('/');
        return;
      }

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
          console.log('Fetched questions:', data); // Debug log
          const transformed = data.questions.map((q) => ({
            id: q.id,
            text: q.question_text,
            options: [
              { id: 'a', text: q.option_a, isCorrect: q.correct_option === 'a' },
              { id: 'b', text: q.option_b, isCorrect: q.correct_option === 'b' },
              { id: 'c', text: q.option_c, isCorrect: q.correct_option === 'c' },
              { id: 'd', text: q.option_d, isCorrect: q.correct_option === 'd' },
            ],
          }));
          setTransformedQuestions(transformed);
          setAnswers(new Array(transformed.length).fill(null));
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
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchQuestions();
    } else {
      setLoading(false);
    }
  }, [examId, navigate]);

  // Detect Tab Switching or Focus Loss
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (examStarted && !examCompleted && document.hidden) {
        setTabSwitchWarning(true);
      }
    };

    const handleBlur = () => {
      if (examStarted && !examCompleted) {
        setTabSwitchWarning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [examStarted, examCompleted]);

  // Timer functionality
  useEffect(() => {
    let timer;
    if (examStarted && !examCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examCompleted, timeLeft]);

  const startExam = () => {
    setExamStarted(true);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) =>
        console.log('Error enabling fullscreen:', err)
      );
    }
  };

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionId;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < transformedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[currentQuestionIndex + 1] || null);
    } else {
      setShowSubmitModal(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1] || null);
    }
  };

  const jumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(answers[index] || null);
  };

  const resetExam = () => {
    setExamStarted(false);
    setCurrentQuestionIndex(0);
    setExamCompleted(false);
    setSelectedOption(null);
    setTimeLeft(durationMins * 60);
    setAnswers(new Array(transformedQuestions.length).fill(null));
    setShowSubmitModal(false);
    setExamResults(null);
    navigate('/user');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setShowSubmitModal(false);
    setExamCompleted(true);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) =>
        console.log('Error exiting fullscreen:', err)
      );
    }

    const accessToken = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type');

    try {
      const payload = {
        exam_id: examId,
        answers: transformedQuestions.map((question, idx) => ({
          question_id: question.id,
          selected_option: answers[idx] || "", // Default to empty string if not answered
        })),
      };
      console.log('Submit payload:', payload); // Debug log

      const response = await fetch('http://4.240.76.3:8000/exams/submit', {
        method: 'POST',
        headers: {
          'Authorization': `${tokenType} ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Submit response:', data); // Debug log
        setExamResults(data);
      } else if (response.status === 403) {
        setError('Access denied. Please log in again.');
        localStorage.clear();
        navigate('/');
      } else if (response.status === 422) {
        const errorData = await response.json();
        setError(`Submission failed: ${errorData.detail || 'Invalid data format'}`);
      } else {
        const errorData = await response.json();
        setError(`Submission failed: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      setError('Network error during submission. Please check your connection.');
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || submitting) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-6"
      >
        <p className="text-green-800 font-semibold">
          {loading ? 'Loading exam...' : 'Submitting your answers...'}
        </p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <AnimatePresence mode="wait">
        {!examStarted ? (
          <WelcomeScreen startExam={startExam} />
        ) : examCompleted ? (
          <ResultScreen
            examResults={examResults}
            timeLeft={timeLeft}
            resetExam={resetExam}
            totalQuestions={transformedQuestions.length}
          />
        ) : (
          <ExamScreen
            currentQuestionIndex={currentQuestionIndex}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            answers={answers}
            setAnswers={setAnswers}
            timeLeft={timeLeft}
            handleOptionClick={handleOptionClick}
            handleNextQuestion={handleNextQuestion}
            handlePrevQuestion={handlePrevQuestion}
            jumpToQuestion={jumpToQuestion}
            onSubmit={handleSubmit}
            showSubmitModal={showSubmitModal}
            setShowSubmitModal={setShowSubmitModal}
            transformedQuestions={transformedQuestions}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tabSwitchWarning && (
          <TabSwitchWarning clearWarning={() => setTabSwitchWarning(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;