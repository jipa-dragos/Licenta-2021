import React, { useContext, useEffect, useState } from 'react'
import '../../App.css'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import Cards from '../../shared/components/UI/Cards'
import Button from '../../shared/components/FormElements/Button'

export default function Quiz() {
  const auth = useContext(AuthContext)
  const [loadedQuestions, setLoadedQuestions] = useState()
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
        setLoadedQuestions(responseData.data[0])
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

    if (currentQuestion + 1 < loadedQuestions.quiz.length)
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
      {!isLoading && loadedQuestions && (
        <>
          {showScore ? (
            <div>
              You scored {score} out of {loadedQuestions.quiz.length} points
            </div>
          ) : (
            <Cards>
              <div>{loadedQuestions.title}</div>
              <div>{loadedQuestions.quiz[currentQuestion].question}</div>
              <div>
                {loadedQuestions.quiz[currentQuestion].answers.map((answer, index) => 
                  <Button onClick={() => handleAnswerButtonClick(answer.isCorrect)} key={index}>
                    {answer.text}
                  </Button>
                )}
              </div>
              {console.log(loadedQuestions.startDate)}
              {console.log(loadedQuestions)}
            </Cards>
          )}
        </>
      )}
    </>
  )
}
