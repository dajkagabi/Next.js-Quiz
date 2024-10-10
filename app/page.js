'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackClass, setFeedbackClass] = useState('');

  useEffect(() => {
    // Load questions from the JSON file
    fetch('/data.json')
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleAnswerClick = (selectedAnswer) => {
    const correctAnswer = questions[currentQuestion].correct;

    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
      setFeedback('Helyes!');
      setFeedbackClass('correct'); // Zöld szín
    } else {
      setFeedback(`Helytelen! A helyes válasz: ${correctAnswer}`);
      setFeedbackClass('incorrect'); // Piros szín
    }

    setShowFeedback(true);

    // Move to the next question after 2 seconds
    setTimeout(() => {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
      setFeedback(''); // Clear feedback for next question
    }, 2000);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowFeedback(false);
    setFeedback('');
  };

  if (questions.length === 0) return <div>Betöltés...</div>;

  if (currentQuestion >= questions.length) {
    return (
      <div className="score">
        <p>A pontszámod: {score}/{questions.length}</p>
        <button className="restart-button" onClick={handleRestart}>
          Újra kezdés
        </button>
      </div>
    );
  }

  return (
    <div>
     
      <h2>{questions[currentQuestion].question}</h2>

      {questions[currentQuestion].answers.map((answer, index) => (
        <button
          key={index}
          onClick={() => handleAnswerClick(answer)}
          disabled={showFeedback} // Disable buttons while showing feedback
        >
          {answer}
        </button>
      ))}

      {showFeedback && <p className={`feedback ${feedbackClass}`}>{feedback}</p>}
    </div>
  );
}
