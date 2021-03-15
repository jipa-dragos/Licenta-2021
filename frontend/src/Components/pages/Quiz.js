import React, { useContext, useEffect, useState } from 'react'
import '../../App.css'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import Cards from '../../shared/components/UI/Cards'
import Button from '../../shared/components/FormElements/Button'

export default function Quiz() {
  const auth = useContext(AuthContext)
  const [loadedQuizzes, setLoadedQuizzes] = useState()
  const { isLoading, sendRequest } = useHttpClient()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/quiz/',
          'GET',
          null,
          {
            Authorization: `Bearer ${auth.token}`,
          }
        )
        console.log(responseData.data[0])
        setLoadedQuizzes(responseData.data[0])
      } catch (err) {
        console.log(err)
      }
    }
    fetchQuizzes()
  }, [sendRequest, auth.token])

  const handleAnswerButtonClick = (isCorrect) => {
    if(isCorrect === true) {
      setScore(score + 1)
    }

    if (currentQuestion + 1 < loadedQuizzes.quiz.length)
      setCurrentQuestion(currentQuestion + 1)
    else setShowScore(true)
  }

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedQuizzes && (
        <>
          {showScore ? (
            <div>
              You scored {score} out of {loadedQuizzes.quiz.length} points
            </div>
          ) : (
            <Cards>
              <div>{loadedQuizzes.title}</div>
              <div>{loadedQuizzes.quiz[currentQuestion].question}</div>
              <div>
                {loadedQuizzes.quiz[currentQuestion].answers.map((answer) => (
                  <Button onClick={() => handleAnswerButtonClick(answer.isCorrect)}>
                    {answer.text}
                  </Button>
                ))}
              </div>
              <div>{console.log(loadedQuizzes)}</div>
            </Cards>
          )}
        </>
      )}
    </>
  )
}
