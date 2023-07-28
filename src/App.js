import React, { useState } from "react";
import axios from "axios";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [numQuestionsInput, setNumQuestionsInput] = useState("5");
  const [loading, setLoading] = useState(false);

  const handleConfirmClick = async () => {
    let numQuestions = parseInt(numQuestionsInput, 10);
    numQuestions = Math.min(50, Math.max(1, numQuestions)); // Limit the number of questions to 1 to 50
    setNumQuestionsInput(numQuestions.toString());

    try {
      setLoading(true);
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=${numQuestions}&type=multiple`
      );
      setQuestions(response.data.results);
      setCurrentQuestion(0);
      setScore(0);
      setShowScore(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  };

  const handleAnswerClick = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  function shuffleAnswers(answers) {
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        {loading ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto"></div>
          </div>
        ) : showScore ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Quiz Score</h1>
            <p className="text-lg">
              You scored {score} out of {questions.length} questions correctly!
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleRestartQuiz}
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl text-center font-bold mb-4">Quiz App</h1>
            {!questions.length ? (
              <div className="mb-4">
                <label className="block font-semibold mb-2">
                  Number of Questions:
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    className="border border-gray-300 p-2 rounded w-24 mr-2"
                    value={numQuestionsInput}
                    onChange={(e) => setNumQuestionsInput(e.target.value)}
                    min="1"
                    max="50"
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleConfirmClick}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Question {currentQuestion + 1}
                </h2>
                <p className="mb-4">{questions[currentQuestion].question}</p>
                <div className="space-y-4">
                  {shuffleAnswers([
                    ...questions[currentQuestion].incorrect_answers,
                    questions[currentQuestion].correct_answer,
                  ]).map((answer, index) => (
                    <button
                      key={index}
                      className="bg-gray-200 flex hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                      onClick={() => handleAnswerClick(answer)}
                    >
                      {answer}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
