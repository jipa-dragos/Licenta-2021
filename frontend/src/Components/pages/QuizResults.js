import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'
import 'antd/dist/antd.css'
import { List } from 'antd'
import { UserOutlined } from '@ant-design/icons'

function QuizResults() {
  const [loadedQuiz, setLoadedQuiz] = useState()
  const { id } = useParams()
  const { isLoading, sendRequest } = useHttpClient()

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5005/api/answer/quiz/${id}`
        )
        let Results = responseData.data.map((data) => ({
          ...data,
          name: 'default',
        }))


        for (let i = 0; i < Results.length; i++) {
          Results[i].name = responseData.array[i]
        }

        Results.quiz = responseData.quiz
        setLoadedQuiz(Results)
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
        <>
          <div>
            <h1>Quiz: {loadedQuiz.quiz}</h1>
          </div>
          {loadedQuiz.length !== 0 && (
            <>
              {console.log(loadedQuiz)}
              <List
                itemLayout='horizontal'
                dataSource={loadedQuiz}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<UserOutlined style={{ fontSize: '43px' }} />}
                      title={Object.values(item.name)}
                      description={`Grade: ${item.grade}`}
                    />
                    <p style={{ marginRight: '30%'}}>
                      Status
                    </p>
                  </List.Item>
                )}
              />
            </>
          )}
          {loadedQuiz.length === 0 && <p>No answers for this quiz!</p>}
        </>
      )}
    </>
  )
}

export default QuizResults
