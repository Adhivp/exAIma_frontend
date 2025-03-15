import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import ExamScreen from './components/ExamScreen';
import ResultScreen from './components/ResultScreen';
import TabSwitchWarning from './components/TabSwitchWarning';
import { questions } from './data/questions';

function App() {
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [examCompleted, setExamCompleted] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [answers, setAnswers] = useState(Array(10).fill(null));

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
      const selected = questions[currentQuestionIndex].options.find(
        (opt) => opt.id === optionId
      );
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = optionId;
      setAnswers(newAnswers);
      if (selected.isCorrect) {
        setScore(score + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(answers[currentQuestionIndex + 1]);
      } else {
        setExamCompleted(true);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch((err) =>
            console.log('Error exiting fullscreen:', err)
          );
        }
      }
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
    setTimeLeft(10 * 60);
    setAnswers(Array(10).fill(null));
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
            totalQuestions={questions.length}
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