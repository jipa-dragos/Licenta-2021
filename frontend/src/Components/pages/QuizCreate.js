import React, {  useEffect, useState } from 'react'
import '../../App.css'
import './QuizCreate.css'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'
import {
  Form,
  Input,
  Button,
  DatePicker,
  Row,
  Col,
  Space,
  Checkbox,
  Select,
  InputNumber
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

export default function QuizCreate() {
  const { isLoading, sendRequest } = useHttpClient()
  const [loadedCourses, setLoadedCourses] = useState()

  const onFinish = async (values) => {
    let newData = values

    let startDate = values.rangeTime[0]._d.toString()
    let endDate = values.rangeTime[1]._d.toString()

    delete newData.rangeTime

    newData.startDate = startDate
    newData.endDate = endDate

    console.log('newData', newData)

    const createQuiz = async () => {
      try {
 
          await sendRequest(
            'http://localhost:5005/api/quiz/',
            'POST',
            JSON.stringify(newData)
          )
        
      } catch (err) {
        console.log(err)
      }
    }
    createQuiz()

  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/course/'
        )
        setLoadedCourses(responseData)
        console.log('am rulat doar la inceput sper')
      } catch (err) {
        console.log(err)
      }
    }
    fetchCourses()
  }, [sendRequest])

  const setQuizDate = () => (
    <Row>
      <Col md={{ span: 12, offset: 8 }}>
        <Form.Item name='rangeTime'>
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
      </Col>
    </Row>
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
        <Form name='dynamic_form_item' {...formItemLayout} onFinish={onFinish}>
          {quizTitle()}
          {courseName()}
          {setQuizDate()}

          <Form.List name='quiz'>
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
                        hasFeedback
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
                        hasFeedback
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
                                  hasFeedback
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
    </>
  )
}
