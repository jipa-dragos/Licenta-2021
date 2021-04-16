import { Button } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'

function Quiz() {
  const auth = useContext(AuthContext)
  const [LoadedQuizzes, setLoadedQuizzes] = useState()
  const { isLoading, sendRequest } = useHttpClient()

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/quiz/prof'
        )
        setLoadedQuizzes(responseData)
      } catch (err) {
        console.log(err)
      }
    }
    fetchQuizzes()
  }, [sendRequest, auth.token])

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}

      {!isLoading && LoadedQuizzes && (
        <>
          <Link to='/create/quiz'>
            <Button
              shape='round'
              type='primary'
              size='large'
              style={{ marginLeft: '46%', marginTop: '3%' }}
            >
              Create Quiz
              {console.log(LoadedQuizzes)}
            </Button>
          </Link>
        </>
      )}
    </>
  )
}

export default Quiz
