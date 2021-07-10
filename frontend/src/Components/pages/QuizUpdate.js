import React, { useEffect, useState } from 'react'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { useParams } from 'react-router'
import { Redirect, useHistory } from 'react-router-dom'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { Form, Input, Select, Button, DatePicker } from 'antd'
import 'antd/dist/antd.css'
import moment from 'moment'

const layout = {
  labelCol: {
    span: 8,
  },
}

const { RangePicker } = DatePicker

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().add(-1, 'days')
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
    console.log(values.quiz)

    console.log(values.rangeTime[0]._d)
    console.log(values.rangeTime[1]._d)
    setRedirect(true)
  }

  const courseTitle = (courses, quiz) => {
    let foundCourseTitle
    for (const course of courses) {
      if (quiz.course === course._id) foundCourseTitle = course.title
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
            <Form.Item
              name='rangeTime'
              label='time'
              initialValue={[
                moment(loadedQuiz.data.startDate),
                moment(loadedQuiz.data.endDate),
              ]}
            >
              <RangePicker
                disabledDate={disabledDate}
                showTime={{ format: 'HH:mm' }}
                format='YYYY-MM-DD HH:mm'
                onFinish={onFinish}
                rules={[
                  {
                    required: true,
                    message: 'Please input your range!',
                  },
                ]}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type='primary' htmlType='submit'>
                Submit
              </Button>
            </Form.Item>
          </Form>
          {console.log(loadedQuiz)}
        </div>
      )}
      {/* {redirect && <Redirect to={{ pathname: history.goBack() }} />} */}
    </>
  )
}

export default QuizUpdate
