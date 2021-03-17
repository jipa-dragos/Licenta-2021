import React, { useContext, useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import Button from '../../shared/components/FormElements/Button'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import Cards from '../../shared/components/UI/Cards'
import Countdown from 'react-countdown'

function QuizPage() {
  const { id } = useParams()
  const auth = useContext(AuthContext)
  const [loadedQuestions, setLoadedQuestions] = useState()
  const { isLoading, sendRequest } = useHttpClient()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [score, setScore] = useState(0)
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/quiz/course/' + id,
          'GET',
          null,
          {
            Authorization: `Bearer ${auth.token}`,
          }
        )
        setLoadedQuestions(responseData.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchQuiz()
  }, [sendRequest, auth.token, id])

  const handleAnswerButtonClick = (isCorrect) => {
    if (isCorrect === true) {
      setScore(score + 1)
    }

    if (currentQuestion + 1 < loadedQuestions.quiz.length)
      setCurrentQuestion(currentQuestion + 1)
    else setShowScore(true)
  }

  const renderer = ({ completed }) => {
    if (completed && !showScore) {
      setShowScore(true)
      return null
    } else {
      return (
        <Countdown
          date={
            new Date(loadedQuestions.startDate).getTime() +
            (new Date(loadedQuestions.endDate).getTime() -
              new Date(loadedQuestions.startDate).getTime())
          }
        />
      )
    }
  }

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedQuestions && (
        <>
          {showScore ? (
            <div>
              You scored {score} out of {loadedQuestions.quiz.length} points
            </div>
          ) : (
            <Cards>
              <div>{loadedQuestions.title}</div>
              <div>Time CountDown</div>
              <Countdown
                date={
                  new Date(loadedQuestions.startDate).getTime() +
                  (new Date(loadedQuestions.endDate).getTime() -
                    new Date(loadedQuestions.startDate).getTime())
                }
                renderer={renderer}
              />

              <div>{loadedQuestions.quiz[currentQuestion].question}</div>
              <div>
                {loadedQuestions.quiz[currentQuestion].answers.map(
                  (answer, index) => (
                    <Button
                      onClick={() => handleAnswerButtonClick(answer.isCorrect)}
                      key={answer._id}
                    >
                      {answer.text}
                    </Button>
                  )
                )}
              </div>
            </Cards>
          )}
        </>
      )}
    </>
  )
}

export default QuizPage
