import { Button, Card, List } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { MinusCircleOutlined } from '@ant-design/icons'

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

  async function fetchQuizzes() {
    const responseData = await sendRequest(
      'http://localhost:5005/api/quiz/prof'
    )

    setLoadedQuizzes(responseData)
  }

  const showModal = (e) => {
    const deleteQuiz = async () => {
      try {
        await sendRequest(
          `http://localhost:5005/api/quiz/${e.currentTarget.id}`,
          'DELETE'
        )
        await fetchQuizzes()
      } catch (err) {
        console.log(err)
      }
    }

    deleteQuiz()
  }

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
            </Button>
          </Link>
          <div>
            <h2>List of Quizzes</h2>
            <p>These are all the quizzes that you created!</p>
          </div>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 3,
            }}
            dataSource={LoadedQuizzes.data}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.title}>
                  <p>AccessCode: {item.accessCode},</p>
                  <p>Number of Questions: {item.quiz.length},</p>
                  <p>Start Date: {item.startDate}</p>
                  <p>End Date: {item.endDate}</p>
                  <MinusCircleOutlined
                    onClick={showModal}
                    id={item._id}
                    style={{ marginLeft: '100%' }}
                  />
                </Card>
              </List.Item>
            )}
          />
        </>
      )}
    </>
  )
}

export default Quiz
