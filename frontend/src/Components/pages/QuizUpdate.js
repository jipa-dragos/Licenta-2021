import React, { useEffect, useState } from 'react'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { useParams } from 'react-router'
import { Redirect, useHistory } from 'react-router-dom'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { Form, Input, Select, Button } from 'antd'
import 'antd/dist/antd.css'

const layout = {
  labelCol: {
    span: 8,
  },
}

function QuizUpdate() {
  const [loadedQuiz, setLoadedQuiz] = useState()
  const [loadedCourses, setLoadedCourses] = useState()
  const [redirect, setRedirect] = useState(false)
  const { isLoading, sendRequest } = useHttpClient()
  const { id } = useParams()
  let history = useHistory()

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5005/api/quiz/update/${id}`
        )
        setLoadedQuiz(responseData)
      } catch (err) {
        console.log(err)
      }
    }
    fetchQuizzes()
    const fetchCourses = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/course/'
        )
        setLoadedCourses(responseData)
      } catch (err) {
        console.log(err)
      }
    }
    fetchCourses()
  }, [sendRequest, id])

  const onFinish = (values) => {
    console.log(values)
    setRedirect(true)
  }

  const courseTitle = (courses, quiz) => {
    let foundCourseTitle
    for (const course of courses) {
      if (quiz.course === course._id) 
        foundCourseTitle = course.title
    }

    return foundCourseTitle
  }

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedQuiz && loadedCourses && (
        <div>
          <Form
            {...layout}
            name='nest-quiz'
            onFinish={onFinish}
            style={{ marginTop: '5%' }}
          >
            <Form.Item
              name={['quiz', 'title']}
              label='title'
              initialValue={loadedQuiz.data.title}
            >
              <Input style={{ width: '50%' }} />
            </Form.Item>

            <Form.Item
              name={['quiz', 'course']}
              label='course'
              initialValue={courseTitle(loadedCourses.data, loadedQuiz.data)}
            >
              <Select style={{ width: '50%' }}>
                {loadedCourses.data.map((course) => (
                  <Select.Option value={course.title} key={course._id}>
                    {course.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type='primary' htmlType='submit'>
                Submit
              </Button>
            </Form.Item>
          </Form>
          {console.log(loadedQuiz)}
          {console.log(loadedCourses.data)}
        </div>
      )}
      {redirect && <Redirect to={{ pathname: history.goBack() }} />}
    </>
  )
}

export default QuizUpdate
