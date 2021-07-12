import React, { useContext, useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'

function Result(props) {
  const auth = useContext(AuthContext)
  const { isLoading, sendRequest } = useHttpClient()
  const [loadedAnswers, setLoadedAnswers] = useState()
  const id = props.history.location.state.id
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    const sendAnswers = async () => {
      try {
        const answersData = await sendRequest(
          `http://localhost:5005/api/answer/${id}`
        )
        setLoadedAnswers(answersData.data)
      } catch (err) {
        setRedirect(true)
      }
    }
    sendAnswers()
  }, [sendRequest, auth.token, id])

  return (
    <>
      {redirect && <Redirect to={{ pathname: props.history.goBack() }} />}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && (
        <>
          <br />
          <br />
          <br />
          <br />
          {loadedAnswers && (
            <div style={{ textAlign: 'center' }}>
              <h1>
                You scored {loadedAnswers.grade}
                {loadedAnswers.grade === 1 && <> point</>}
                {loadedAnswers.grade !== 1 && <> points</>}
              </h1>
            </div>
          )}
          {!loadedAnswers && (
            <div style={{ textAlign: 'center' }}>
              <h1>You have successfully completed the quiz.</h1>
              <h2>...</h2>
              <h2>
                Quiz end date did not expire yet... You will receive your grade on
                your quiz results tab as soon as the quiz ends.
              </h2>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Result
