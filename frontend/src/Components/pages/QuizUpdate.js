import React, { useEffect, useState } from 'react'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { useParams } from 'react-router'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'

function QuizUpdate() {
  const [loadedQuiz, setLoadedQuiz] = useState()
  const { isLoading, sendRequest } = useHttpClient()
  const { id } = useParams()

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5005/api/quiz/update/${id}`
        )
        setLoadedQuiz(responseData)
      } catch (err) {
        console.log(err)
      }
    }
    fetchQuizzes()
  }, [sendRequest])

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedQuiz && (
        <div>
          salutASDA
          {console.log(loadedQuiz)}
        </div>
      )}
    </>
  )
}

export default QuizUpdate
