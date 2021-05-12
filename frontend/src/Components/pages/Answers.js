import React, { useContext, useEffect, useState } from 'react'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { List, Avatar, Divider, Tag } from 'antd'
import 'antd/dist/antd.css'
import TableComponent from '../Table'

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
        setLoadedAnswers(responseData.data)
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
          <List
            itemLayout='horizontal'
            dataSource={loadedAnswers}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src='/images/quizicon.png' />}
                  title={<p style={{ fontSize: 20 }}>{item.title}</p>}
                  description={
                    <>
                      <h2>Course: {item.courseName}</h2>
                      <h2>grade: {item.grades}</h2>

                      <Divider orientation='left'>
                        <Tag color='gold'>Questions</Tag>
                      </Divider>

                      <List
                        size='default'
                        bordered
                        dataSource={item.questions}
                        renderItem={(item, index) => (
                          <List.Item>
                            {index + 1}. {item}
                          </List.Item>
                        )}
                      />
                      <Divider orientation='left'>
                        <Tag color='#f50'>Tags</Tag>
                      </Divider>

                      <List
                        size='default'
                        bordered
                        dataSource={item.tags}
                        renderItem={(item, index) => (
                          <List.Item>
                            {index + 1}. {item}
                          </List.Item>
                        )}
                      />

                      <Divider orientation='left'>
                        <Tag color='gold'>Sent answers</Tag>
                      </Divider>
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
                      <Divider orientation='left'>
                        <Tag color='purple'>Correct Answers</Tag>
                      </Divider>
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
          <TableComponent />
        </>
      )}
    </>
  )
}

export default Answers
