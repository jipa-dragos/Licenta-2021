import React, { useContext, useState, useEffect } from 'react'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'

function Result(props) {
  const auth = useContext(AuthContext)
  const { isLoading, sendRequest } = useHttpClient()
  const [loadedAnswers, setLoadedAnswers] = useState()
  const id = props.history.location.state.id
  const answers = props.history.location.state.answers

  useEffect(() => {
    const sendAnswers = async () => {
      try {
        const answersData = await sendRequest(
          'http://localhost:5005/api/answer/',
          'POST',
          JSON.stringify({
            answers: answers,
            quiz: id,
          }),
          {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          }
        )
        setLoadedAnswers(answersData)
      } catch (err) {
        console.log(err)
      }
    }
    sendAnswers()
  }, [sendRequest, auth.token, id, answers])

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedAnswers && (
        <>
          Grade for this quiz is {loadedAnswers.data.grade}
        </>
      )}
    </>
  )
}

export default Result
