import React, { useEffect, useState } from 'react'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { useParams } from 'react-router'
import { Redirect, useHistory } from 'react-router-dom'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import {
  Form,
  Input,
  Button,
  DatePicker,
  Space,
  Checkbox,
  Select,
  InputNumber,
} from 'antd'
import 'antd/dist/antd.css'
import moment from 'moment'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const layout = {
  labelCol: {
    span: 8,
  },
}

const { RangePicker } = DatePicker
const { TextArea } = Input

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
              name={['quiz', 'rangeTime']}
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

            <Form.List name='quizQuestion' initialValue={loadedQuiz.data.quiz}>
              {(fields2, { add, remove }) => (
                <>
                  {fields2.map((field2) => (
                    <React.Fragment key={field2.key}>
                      <Space
                        style={{
                          display: 'flex',
                          marginBottom: 8,
                          marginLeft: 330,
                        }}
                        align='baseline'
                      >
                        <Form.Item
                          {...field2}
                          wrapperCol={{
                            span: 20,
                            offset: 6,
                          }}
                          name={[field2.name, 'question']}
                          fieldKey={[field2.fieldKey, 'question']}
                          rules={[
                            {
                              required: true,
                              message: 'Missing question',
                            },
                          ]}
                        >
                          <TextArea
                            style={{ width: 1000 }}
                            rows={1}
                            size='large'
                            placeholder='q/a'
                          />
                        </Form.Item>

                        <Form.Item
                          {...field2}
                          wrapperCol={{
                            span: 23,
                            offset: 16,
                          }}
                          style={{ width: 400, marginLeft: -150 }}
                          name={[field2.name, 'tag']}
                          fieldKey={[field2.fieldKey, 'tag']}
                          rules={[
                            {
                              required: true,
                              message: 'Missing tag',
                            },
                          ]}
                        >
                          <Input size='small' placeholder='TAG' />
                        </Form.Item>

                        <MinusCircleOutlined
                          style={{ marginLeft: 10 }}
                          onClick={() => remove(field2.name)}
                        />
                      </Space>
                      <Form.List name={[field2.name, 'answers']}>
                        {(answers, { add, remove }) => {
                          return (
                            <>
                              {answers.map((answer) => (
                                <Space key={answer.key} align='baseline'>
                                  <Form.Item
                                    {...answer}
                                    wrapperCol={{
                                      span: 12,
                                      offset: 11,
                                    }}
                                    style={{ width: 1000, marginLeft: 30 }}
                                    name={[answer.name, 'text']}
                                    fieldKey={[answer.fieldKey, 'text']}
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Missing answer',
                                      },
                                    ]}
                                  >
                                    <Input placeholder='answer' />
                                  </Form.Item>

                                  <Form.Item
                                    name={[answer.name, 'isCorrect']}
                                    valuePropName='checked'
                                    noStyle
                                    initialValue={false}
                                  >
                                    <Checkbox>Correct</Checkbox>
                                  </Form.Item>

                                  <p
                                    style={{ marginLeft: 40, marginRight: -40 }}
                                  >
                                    Points
                                  </p>
                                  <Form.Item
                                    {...answer}
                                    wrapperCol={{
                                      span: 12,
                                      offset: 11,
                                    }}
                                    name={[answer.name, 'points']}
                                    fieldKey={[answer.fieldKey, 'points']}
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Missing points',
                                      },
                                    ]}
                                    initialValue={0}
                                  >
                                    <InputNumber min={0} max={10} />
                                  </Form.Item>

                                  <MinusCircleOutlined
                                    style={{ marginLeft: 40 }}
                                    onClick={() => {
                                      remove(answer.name)
                                    }}
                                  />
                                </Space>
                              ))}

                              <Form.Item
                                wrapperCol={{
                                  span: 12,
                                  offset: 6,
                                }}
                              >
                                <Button
                                  type='dashed'
                                  onClick={() => {
                                    add()
                                  }}
                                  block
                                >
                                  <PlusOutlined /> Add Answer
                                </Button>
                              </Form.Item>
                            </>
                          )
                        }}
                      </Form.List>
                    </React.Fragment>
                  ))}
                  <Form.Item
                    wrapperCol={{
                      span: 12,
                      offset: 6,
                    }}
                  >
                    <Button
                      type='default'
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Question
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

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
