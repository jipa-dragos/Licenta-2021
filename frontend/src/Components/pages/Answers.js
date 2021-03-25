import React, { useContext, useEffect, useState } from 'react'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { List, Avatar, Divider } from 'antd'
import {
  BookOutlined,
  MenuOutlined
} from '@ant-design/icons';
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
          <List
            itemLayout='horizontal'
            dataSource={loadedAnswers.data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar src='http://cdn.onlinewebfonts.com/svg/img_383124.png' />
                  }
                  title={<h2>{item.title}</h2>}
                  description={
                    <>
                      <p>grade: {item.grades}</p>
                      <Divider orientation='left'>Sent Answers</Divider>
                      <List
                        size='default'
                        bordered
                        dataSource={item.answers}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
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
