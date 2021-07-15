import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { Link } from 'react-router-dom'
import { Col, Row, Card, Divider, Tag, Empty } from 'antd'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'

function CoursePage() {
  const course = useParams()
  const auth = useContext(AuthContext)
  const [loadedCourse, setLoadedCourse] = useState()
  const [loadedIds, setLoadedIds] = useState()
  const { isLoading, sendRequest } = useHttpClient()
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5005/api/course/${course.title}`
        )

        setLoadedCourse(responseData)
      } catch (err) {
        console.log(err)
      }
    }
    const fetchAnswers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5005/api/answer/courseName/${course.title}`
        )
        let ids = []
        for (let i of responseData.data) {
          ids.push(i.quiz)
        }

        setLoadedIds(ids)
      } catch (err) {
        console.log(err)
      }
    }
    fetchCourse()
    fetchAnswers()
  }, [sendRequest, auth.token, course.title])

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}

      {!isLoading && loadedCourse && loadedIds && (
        <Row>
          <Col span={24}>
            <Divider style={{ fontSize: '50px' }}>
              {loadedCourse.data.title}
            </Divider>
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            {loadedCourse.data.type === 'course' && (
              <Tag color='#87d068'>{loadedCourse.data.type}</Tag>
            )}
            {loadedCourse.data.type !== 'course' && (
              <Tag color='#2db7f5'>{loadedCourse.data.type}</Tag>
            )}
          </Col>
          <Col span={24} style={{ marginTop: '2%', textAlign: 'center' }}>
            <label style={{ textDecoration: 'underline' }}>Description:</label>
            <p style={{ fontSize: 18 }}>{loadedCourse.data.description}</p>
          </Col>
          <Col span={24} style={{ marginTop: '2%', textAlign: 'center' }}>
            {auth.role && <p>Quizzes for this course:</p>}
            {!auth.role && <p>Available quizzes:</p>}
          </Col>

          {loadedCourse.quiz.map((quiz, index) => (
            <React.Fragment key={index}>
              {!loadedIds.includes(quiz._id) && !auth.role && (
                <Col span={6}>
                  {new Date().toISOString() >=
                    new Date(quiz.startDate).toISOString() && (
                    <Link to={`/quiz/${quiz._id}`} key={index}>
                      <Card
                        hoverable
                        title={quiz.title}
                        style={{ width: 300, marginLeft: '10%' }}
                      >
                        <p>Start: {quiz.startDate}</p>
                        <p>Finish: {quiz.endDate}</p>
                        <p>Questions: {loadedCourse.questionsNo[index]}</p>
                      </Card>
                    </Link>
                  )}
                  {new Date().toISOString() <
                    new Date(quiz.startDate).toISOString() && (
                    <Card
                      title={quiz.title}
                      style={{ width: 300, marginLeft: '10%' }}
                    >
                      <p>Start: {quiz.startDate}</p>
                      <p>Finish: {quiz.endDate}</p>
                      <p>Questions: {loadedCourse.questionsNo[index]}</p>
                    </Card>
                  )}
                </Col>
              )}

              {auth.role && !loadedIds.includes(quiz._id) && (
                <Col span={6}>
                  <Card
                    title={quiz.title}
                    style={{ width: 300, marginLeft: '10%' }}
                  >
                    <p>Start: {quiz.startDate}</p>
                    <p>Finish: {quiz.endDate}</p>
                    <p>Questions: {quiz.quiz.length}</p>
                  </Card>
                </Col>
              )}
            </React.Fragment>
          ))}

          {loadedCourse.quiz.length === 0 && (
            <Empty description='No quiz' style={{ margin: 'auto' }} />
          )}
        </Row>
      )}
    </>
  )
}

export default CoursePage
