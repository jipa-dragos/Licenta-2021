import React, { useEffect, useState } from 'react'
import '../../App.css'
import './QuizCreate.css'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { Redirect, useHistory } from 'react-router-dom'
import { useHttpClient } from '../../shared/hooks/http-hook'
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
import moment from 'moment'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker
const { TextArea } = Input
const { Option } = Select

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().add(-1, 'days')
}

export default function QuizCreate(props) {
  const { isLoading, sendRequest } = useHttpClient()
  const [loadedCourses, setLoadedCourses] = useState()
  const [loadedQuizzes, setLoadedQuizzes] = useState()
  const [isFinalQuiz, setisFinalQuiz] = useState()
  const [redirect, setRedirect] = useState(false)
  let history = useHistory()

  const onFinish = async (values) => {
    let newData = values

    let startDate = values.rangeTime[0]._d
      .setHours(values.rangeTime[0]._d.getHours() + 3)
      .toString()

    let endDate = values.rangeTime[1]._d
      .setHours(values.rangeTime[1]._d.getHours() + 3)
      .toString()

    let isFinal = false
    if (isFinalQuiz) {
      let tags = []
      let numbers = []
      if (newData.final) {
        for (const i of newData.final) {
          tags.push(i.tag)
          numbers.push(i.number)
        }
        delete newData.final

        newData.tags = tags
        newData.numbers = numbers
        isFinal = true
      }
    }
    delete newData.rangeTime

    newData.startDate = startDate
    newData.endDate = endDate

    try {
      if (isFinal) {
        await sendRequest(
          'http://localhost:5005/api/quiz/final',
          'POST',
          JSON.stringify(newData)
        )
      } else {
        await sendRequest(
          'http://localhost:5005/api/quiz/',
          'POST',
          JSON.stringify(newData)
        )
      }
    } catch (err) {
      console.log(err)
    }
    setRedirect(true)
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/course/'
        )
        setLoadedCourses(responseData)

        try {
          const quizFinal = props.location.state.finalQuiz
          setisFinalQuiz(quizFinal)
        } catch {}
      } catch (err) {
        console.log(err)
      }
    }
    fetchCourses()
    const fetchQuizzes = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/quiz/'
        )

        let tags = []
        for (const quiz of responseData.data) {
          for (const question of quiz.quiz) {
            tags.push(question.tag)
          }
        }

        let count = {}
        tags.forEach(function (i) {
          count[i] = (count[i] || 0) + 1
        })
        setLoadedQuizzes(count)
      } catch (err) {}
    }
    fetchQuizzes()
  }, [sendRequest, props])

  const setQuizDate = () => (
    <Form.Item name='rangeTime' label='Time'>
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
  )

  const quizTitle = () => (
    <Form.Item
      label='Title'
      name='title'
      hasFeedback
      rules={[
        {
          required: true,
          message: 'Please input your title!',
        },
      ]}
    >
      <Input />
    </Form.Item>
  )

  const courseName = () => (
    <Form.Item
      label='CourseName'
      name='courseName'
      hasFeedback
      rules={[
        {
          required: true,
          message: 'Please select your Course!',
        },
      ]}
    >
      <Select placeholder='Please select a course'>
        {loadedCourses.data.map((course) => (
          <Option key={course._id} value={course.title}>
            {course.title}
          </Option>
        ))}
      </Select>
    </Form.Item>
  )

  const button = () => (
    <Form.Item
      wrapperCol={{
        span: 12,
        offset: 6,
      }}
    >
      <Button type='primary' htmlType='submit'>
        Submit
      </Button>
    </Form.Item>
  )

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedCourses && (
        <Form
          name='dynamic_form_item'
          {...formItemLayout}
          onFinish={onFinish}
          style={{ marginTop: '5%' }}
        >
          {quizTitle()}
          {courseName()}
          {setQuizDate()}
          {isFinalQuiz && (
            <Form.List name='final'>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <React.Fragment key={field.key}>
                      <Space
                        style={{
                          display: 'flex',
                          marginBottom: 8,
                          marginLeft: 500,
                        }}
                        align='baseline'
                      >
                        <Form.Item
                          {...field}
                          wrapperCol={{
                            span: 200,
                            offset: 6,
                          }}
                          name={[field.name, 'tag']}
                          fieldKey={[field.fieldKey, 'tag']}
                        >
                          <Select
                            placeholder='Please select a tag'
                            style={{ minWidth: '200px' }}
                          >
                            {Object.keys(loadedQuizzes).map((quiz, index) => (
                              <Option key={index} value={quiz}>
                                {quiz}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          {...field}
                          hasFeedback
                          wrapperCol={{
                            span: 23,
                            offset: 16,
                          }}
                          style={{ width: 400, marginLeft: -150 }}
                          name={[field.name, 'number']}
                          fieldKey={[field.fieldKey, 'number']}
                          rules={[
                            {
                              required: true,
                              message: 'Missing number',
                            },
                          ]}
                        >
                          <InputNumber
                            size='small'
                            placeholder='number'
                            min={1}
                          />
                        </Form.Item>

                        <MinusCircleOutlined
                          style={{ marginLeft: 10 }}
                          onClick={() => remove(field.name)}
                        />
                      </Space>
                    </React.Fragment>
                  ))}
                  <Form.Item
                    wrapperCol={{
                      span: 12,
                      offset: 6,
                    }}
                  >
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add random quiz questions
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          )}
          <Form.List name='quiz'>
            {(fields2, { add, remove }) => (
              <>
                {fields2.map((field2) => (
                  <React.Fragment key={field2.key}>
                    <Space
                      style={{
                        display: 'flex',
                        marginBottom: 8,
                        marginLeft: 175,
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
                          style={{ width: 500 }}
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

                      <Form.Item
                        {...field2}
                        hasFeedback
                        wrapperCol={{
                          span: 20,
                          offset: 6,
                        }}
                        name={[field2.name, 'feedback']}
                        fieldKey={[field2.fieldKey, 'feedback']}
                        style={{
                          width: '544px',
                          bottom: 5,
                          position: 'relative',
                        }}
                      >
                        <Input size='middle' placeholder='feedback' />
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

                                <p style={{ marginLeft: 40, marginRight: -40 }}>
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
          {button()}
        </Form>
      )}
      {redirect && <Redirect to={{ pathname: history.goBack() }} />}
    </>
  )
}
