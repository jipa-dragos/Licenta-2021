import React, { useContext, useState, useEffect } from 'react'
import { Redirect, useParams } from 'react-router'
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
  const [lastQuestion, setLastQuestion] = useState(false)
  const [answers, setAnswers] = useState([])
  const path = `/quiz/${id}/result`

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

  const handleAnswerButtonClick = (buttonText) => {
    setAnswers([...answers, buttonText])

    if (currentQuestion + 1 < loadedQuestions.quiz.length)
      setCurrentQuestion(currentQuestion + 1)
    else setLastQuestion(true)
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
          {new Date(loadedQuestions.endDate).getTime() < Date.now() ||
          lastQuestion ? (
            <Redirect to={{ pathname: path, state: { id: id, answers: answers }}} />
          ) : (
            <Cards>
              <div>{loadedQuestions.title}</div>
              <div>
                Remaining Time
                <Countdown
                  date={
                    new Date(loadedQuestions.startDate).getTime() +
                    (new Date(loadedQuestions.endDate).getTime() -
                      new Date(loadedQuestions.startDate).getTime())
                  }
                />
              </div>
              <div>{loadedQuestions.quiz[currentQuestion].question}</div>
              <div>
                {loadedQuestions.quiz[currentQuestion].answers.map((answer) => (
                  <Button
                    onClick={() => handleAnswerButtonClick(answer.text)}
                    key={answer._id}
                  >
                    {answer.text}
                  </Button>
                ))}
              </div>
            </Cards>
          )}
        </>
      )}
    </>
  )
}

export default QuizPage
