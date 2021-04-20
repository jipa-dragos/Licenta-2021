import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'

function QuizUpdate() {
  const [loadedQuiz, setLoadedQuiz] = useState()
  const { id } = useParams()
  const { isLoading, sendRequest } = useHttpClient()

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5005/api/quiz/course/${id}`
        )
        setLoadedQuiz(responseData)
      } catch (err) {
        console.log(err)
      }
    }
    fetchQuiz()
  }, [sendRequest, id])
  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}

      {!isLoading && loadedQuiz && (
        <div>
          Update Quiz Page
          {console.log(loadedQuiz)}
        </div>
      )}
    </>
  )
}

export default QuizUpdate
