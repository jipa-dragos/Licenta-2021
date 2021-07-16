import { Popover, Button, Card, List, Row, Col, Input } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { MinusCircleOutlined, EditOutlined } from '@ant-design/icons'
import Modal from 'antd/lib/modal/Modal'

function Quiz() {
  const auth = useContext(AuthContext)
  const [LoadedQuizzes, setLoadedQuizzes] = useState()
  const { isLoading, sendRequest } = useHttpClient()
  const [disabled, setDisabled] = useState(true)
  const [id, setId] = useState()
  const [courseTitle, setCourseTitle] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)

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
    setIsModalVisible(true)
    setId(e.currentTarget.getAttribute('id'))
    setCourseTitle(e.currentTarget.getAttribute('title'))
  }

  const inputEl = (e) => {
    e.target.value === courseTitle ? setDisabled(false) : setDisabled(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleDelete = () => {
    setIsModalVisible(false)

    const deleteCourse = async () => {
      try {
        await sendRequest(`http://localhost:5005/api/quiz/${id}`, 'DELETE')

        await fetchQuizzes()
      } catch (err) {
        console.log(err)
      }
    }

    deleteCourse()
  }

  const content = (
    <div style={{ paddingLeft: '10%' }}>
      <Link to='/create/quiz'>
        <Button>Normal</Button>
      </Link>
      <Link to={{ pathname: '/create/quiz', state: { finalQuiz: true } }}>
        <Button>Final</Button>
      </Link>
    </div>
  )

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}

      {!isLoading && LoadedQuizzes && (
        <>
          <div
            style={{
              marginTop: '3%',
              textAlign: 'center'
            }}
          >
            <Popover
              content={content}
              title='Select the type of quiz to create'
            >
              <Button shape='round' type='primary' size='large'>
                Create Quiz
              </Button>
            </Popover>{' '}
          </div>
          <div style={{ textAlign: 'center' }}>
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
                <Card title={item.title} hoverable>
                  <p>AccessCode: {item.accessCode},</p>
                  <p>Number of Questions: {item.quiz.length},</p>
                  <p>Start Date: {item.startDate}</p>
                  <p>End Date: {item.endDate}</p>
                  <Link to={`/results/quiz/${item._id}`}>
                    <p>Click to see results</p>
                  </Link>
                  <Row>
                    <Col>
                      <MinusCircleOutlined
                        onClick={showModal}
                        id={item._id}
                        title={item.title}
                      />
                    </Col>
                    <Col push={23}>
                      <Link to={`/update/quiz/${item._id}`}>
                        <EditOutlined />
                      </Link>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />

          <Modal
            title='Delete Quiz'
            visible={isModalVisible}
            footer={
              <>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button disabled={disabled} danger onClick={handleDelete}>
                  Delete
                </Button>
              </>
            }
            onCancel={handleCancel}
          >
            <h3>All the answers related to this quiz will be deleted</h3>
            <p>To delete the quiz, type the title of the quiz to confirm.</p>
            <Input onChange={inputEl} />
          </Modal>
        </>
      )}
    </>
  )
}

export default Quiz
