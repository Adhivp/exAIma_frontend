import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import ExamScreen from './components/ExamScreen';
import ResultScreen from './components/ResultScreen';
import TabSwitchWarning from './components/TabSwitchWarning';

function App() {
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [examCompleted, setExamCompleted] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Will be set based on fetched data
  const [answers, setAnswers] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const location = useLocation();
  const { state } = location;
  const { examId, questions = [] } = state || {};

  // Set timeLeft and answers based on fetched exam data
  useEffect(() => {
    if (examId) {
      // Assuming the duration_mins comes from the initial exams API, we'll use a mapping or fetch it again if needed
      const examDuration = {
        '1': 60, // Python Fundamentals
        '2': 45, // Vite JS Framework
        '3': 90, // Microsoft Azure Cloud
      }[examId] || 60; // Default to 60 minutes if not found
      setTimeLeft(examDuration * 60); // Convert to seconds
      setAnswers(new Array(questions.length).fill(null));
    }
  }, [examId, questions]);

  // Timer functionality
  useEffect(() => {
    let timer;
    if (examStarted && !examCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setExamCompleted(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examCompleted, timeLeft]);

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

  const startExam = () => {
    setExamStarted(true);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) =>
        console.log('Error enabling fullscreen:', err)
      );
    }
  };

  const handleOptionClick = (optionId) => {
    if (!selectedOption) {
      setSelectedOption(optionId);
      const selected = questions[currentQuestionIndex]?.options.find(
        (opt) => opt.id === optionId
      );
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = optionId;
      setAnswers(newAnswers);
      if (selected?.isCorrect) {
        setScore(score + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[currentQuestionIndex + 1]);
    } else {
      setShowSubmitModal(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1]);
    }
  };

  const jumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(answers[index]);
  };

  const resetExam = () => {
    setExamStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setExamCompleted(false);
    setSelectedOption(null);
    const examDuration = {
      '1': 60,
      '2': 45,
      '3': 90,
    }[examId] || 60;
    setTimeLeft(examDuration * 60);
    setAnswers(new Array(questions.length).fill(null));
    setShowSubmitModal(false);
  };

  const onSubmit = () => {
    setExamCompleted(true);
    setShowSubmitModal(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) =>
        console.log('Error exiting fullscreen:', err)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <AnimatePresence mode="wait">
        {!examStarted ? (
          <WelcomeScreen startExam={startExam} />
        ) : examCompleted ? (
          <ResultScreen
            score={score}
            timeLeft={timeLeft}
            resetExam={resetExam}
            totalQuestions={answers.length}
          />
        ) : (
          <ExamScreen
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            selectedOption={selectedOption}
            answers={answers}
            timeLeft={timeLeft}
            handleOptionClick={handleOptionClick}
            handleNextQuestion={handleNextQuestion}
            handlePrevQuestion={handlePrevQuestion}
            jumpToQuestion={jumpToQuestion}
            onSubmit={onSubmit}
            showSubmitModal={showSubmitModal}
            setShowSubmitModal={setShowSubmitModal}
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