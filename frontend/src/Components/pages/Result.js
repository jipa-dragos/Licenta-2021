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
        setLoadedAnswers(answersData)
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
      {!isLoading && loadedAnswers && (
        <>Grade for this quiz is {loadedAnswers.data.grade}</>
      )}
    </>
  )
}

export default Result
