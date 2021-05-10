import React, { useContext, useEffect, useState } from 'react'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { List, Avatar, Divider } from 'antd'
import 'antd/dist/antd.css'

function Answers() {
  const auth = useContext(AuthContext)
  const { isLoading, sendRequest } = useHttpClient()
  const [loadedAnswers, setLoadedAnswers] = useState()

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/answer/'
        )
        setLoadedAnswers(responseData)
      } catch (err) {
        console.log(err)
      }
    }
    fetchAnswers()
  }, [sendRequest, auth.token])

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedAnswers && (
        <>
          {console.log(loadedAnswers)}
          <List
            itemLayout='horizontal'
            dataSource={loadedAnswers.data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src='/images/quizicon.png' />}
                  title={<p style={{ fontSize: 20 }}>{item.title}</p>}
                  description={
                    <>
                      <h2>grade: {item.grades}</h2>

                      <Divider orientation='left'>Sent Answers</Divider>

                      <List
                        size='default'
                        bordered
                        dataSource={item.answers}
                        renderItem={(item, index) => (
                          <List.Item>
                            {index + 1}. {item}
                          </List.Item>
                        )}
                      />
                      <Divider orientation='left'>Correct Answers</Divider>

                      <List
                        size='default'
                        bordered
                        dataSource={item.correctAnswers}
                        renderItem={(item, index) => (
                          <List.Item key={index}>
                            {index + 1}. {item}
                          </List.Item>
                        )}
                      />
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </>
      )}
    </>
  )
}

export default Answers
