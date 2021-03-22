import React, { useContext, useEffect, useState } from 'react'
import '../../App.css'
import './QuizCreate.css'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
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
} from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker

// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 4 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 20 },
//   },
// }
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
}

export default function QuizCreate() {
  const { isLoading, sendRequest } = useHttpClient()
  const auth = useContext(AuthContext)
  const [loadData, setLoadData] = useState()

  const onFinish = async (values) => {
    setLoadData(values)
  }

  useEffect(() => {
    const createQuiz = async () => {
      try {
        if (!loadData) {
          console.log('data not loaded')
        } else {
          await sendRequest(
            'http://localhost:5005/api/quiz/',
            'POST',
            JSON.stringify({
              title: loadData.title,
              quiz: [
                {
                  question: loadData.question[0].question,
                  answers: [
                    {
                      text: loadData.question[0].answer1,
                      isCorrect: loadData.question[0].isCorrect1,
                    },
                    {
                      text: loadData.question[0].answer2,
                      isCorrect: loadData.question[0].isCorrect2,
                    },
                  ],
                },
              ],
              startDate: '2021-05-22T16:48:09.033+00:00',
              endDate: '2021-05-22T15:48:09.033+00:00',
              courseName: 'POO',
            }),
            {
              'Authorization': `Bearer ${auth.token}`,
              'Content-Type': 'application/json',
            }
          )
        }
      } catch (err) {
        console.log(err)
      }
    }
    createQuiz()
  }, [sendRequest, loadData, auth.token])
  const setQuizDate = () => (
    <Row>
      <Col md={{ span: 12, offset: 8 }}>
        <Form.Item name='range-time-picker'>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format='YYYY-MM-DD HH:mm'
            onFinish={onFinish}
            rules={[
              {
                required: true,
                message: 'Please input your title!',
              },
            ]}
          />
        </Form.Item>
        <Form.Item label='Quiz'></Form.Item>
      </Col>
    </Row>
  )

  const quizTitle = () => (
    <Form.Item
      label='Title'
      name='title'
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
      rules={[
        {
          required: true,
          message: 'Please input your Course!',
        },
      ]}
    >
      <Input />
    </Form.Item>
  )

  const button = () => (
    <Form.Item>
      <Button type='primary' htmlType='submit'>
        Submit
      </Button>
    </Form.Item>
  )

  // const formList = () => (
  //   <Form.List name='questions'>
  //     {(fields, { add, remove }) => (
  //       <>
  //         {fields.map((field) => (
  //           <Space
  //             key={field.key}
  //             style={{
  //               display: 'flex',
  //               marginBottom: 8,
  //               marginLeft: 400,
  //             }}
  //             align='baseline'
  //           >
  //             <Form.Item
  //               {...field}
  //               name={[field.name, 'answer1']}
  //               fieldKey={[field.fieldKey, 'answer1']}
  //               rules={[
  //                 {
  //                   required: true,
  //                   message: 'Missing answer1',
  //                 },
  //               ]}
  //             >
  //               <Input placeholder='answer1' />
  //             </Form.Item>
  //             <Form.Item
  //               name={[field.name, 'isCorrect']}
  //               valuePropName='checked'
  //               noStyle
  //               initialValue={false}
  //             >
  //               <Checkbox>Correct</Checkbox>
  //             </Form.Item>
  //             <MinusCircleOutlined onClick={() => remove(field.name)} />
  //           </Space>
  //         ))}
  //         <Form.Item>
  //           <Button
  //             type='default'
  //             onClick={() => add()}
  //             block
  //             icon={<PlusOutlined />}
  //           >
  //             Add answer
  //           </Button>
  //         </Form.Item>
  //       </>
  //     )}
  //   </Form.List>
  // )

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && (
        <Form
          name='dynamic_form_item'
          {...formItemLayoutWithOutLabel}
          onFinish={onFinish}
        >
          {quizTitle()}
          {courseName()}
          {setQuizDate()}
          {/* <Form.List name='users'>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{
                      display: 'flex',
                      marginBottom: 8,
                      marginLeft: 400,
                    }}
                    align='baseline'
                  > */}

          <Form.List name='question'>
            {(fields2, { add, remove }) => (
              <>
                {fields2.map((field2) => (
                  <Space
                    key={field2.key}
                    style={{
                      display: 'grid',
                      marginBottom: 8,
                    }}
                    align='baseline'
                  >
                    <Form.Item
                      {...field2}
                      name={[field2.name, 'question']}
                      fieldKey={[field2.fieldKey, 'question']}
                    >
                      <Input placeholder='q/a' />
                    </Form.Item>
                    {/* {formList()} */}
                    <Space
                      style={{
                        display: 'flex',
                        marginBottom: 10,
                        marginLeft: 100,
                      }}
                      align='baseline'
                    >
                      {/* <Form.List name='answer'>
                        {(fields2, {add, remove}) => (
                          <>
                            {fields2.map((field) => (
                              <React.Fragment key={field.key}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'answer1']}
                                  fieldKey={[field.fieldKey, 'answer1']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Missing answer1',
                                    },
                                  ]}
                                >
                                  <Input placeholder='answer1' />
                                </Form.Item>

                                <Form.Item
                                  name={[field.name, 'isCorrect1']}
                                  valuePropName='checked'
                                  noStyle
                                  initialValue={false}
                                >
                                  <Checkbox>Correct</Checkbox>
                                </Form.Item>
                              </React.Fragment>
                            ))}
                            <Form.Item>
                              <Button
                                type='default'
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add answer
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List> */}

                      <Form.Item
                        {...field2}
                        name={[field2.name, 'answer1']}
                        fieldKey={[field2.fieldKey, 'answer1']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing answer1',
                          },
                        ]}
                      >
                        <Input placeholder='answer1' />
                      </Form.Item>

                      <Form.Item
                        name={[field2.name, 'isCorrect1']}
                        valuePropName='checked'
                        noStyle
                        initialValue={false}
                      >
                        <Checkbox>Correct</Checkbox>
                      </Form.Item>
                      <Form.Item
                        {...field2}
                        name={[field2.name, 'answer2']}
                        fieldKey={[field2.fieldKey, 'answer2']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing answer2',
                          },
                        ]}
                      >
                        <Input placeholder='answer2' />
                      </Form.Item>

                      <Form.Item
                        name={[field2.name, 'isCorrect2']}
                        valuePropName='checked'
                        noStyle
                        initialValue={false}
                      >
                        <Checkbox>Correct</Checkbox>
                      </Form.Item>
                      <Form.Item
                        {...field2}
                        name={[field2.name, 'answer3']}
                        fieldKey={[field2.fieldKey, 'answer3']}
                      >
                        <Input placeholder='answer3' />
                      </Form.Item>

                      <Form.Item
                        name={[field2.name, 'isCorrect3']}
                        valuePropName='checked'
                        noStyle
                        initialValue={false}
                      >
                        <Checkbox>Correct</Checkbox>
                      </Form.Item>

                      <Form.Item
                        {...field2}
                        name={[field2.name, 'answer4']}
                        fieldKey={[field2.fieldKey, 'answer4']}
                      >
                        <Input placeholder='answer4' />
                      </Form.Item>

                      <Form.Item
                        name={[field2.name, 'isCorrect4']}
                        valuePropName='checked'
                        noStyle
                        initialValue={false}
                      >
                        <Checkbox>Correct</Checkbox>
                      </Form.Item>

                      <Form.Item
                        {...field2}
                        name={[field2.name, 'answer5']}
                        fieldKey={[field2.fieldKey, 'answer5']}
                      >
                        <Input placeholder='answer5' />
                      </Form.Item>

                      <Form.Item
                        name={[field2.name, 'isCorrect5']}
                        valuePropName='checked'
                        noStyle
                        initialValue={false}
                      >
                        <Checkbox>Correct</Checkbox>
                      </Form.Item>
                      <Form.Item
                        {...field2}
                        name={[field2.name, 'answer6']}
                        fieldKey={[field2.fieldKey, 'answer6']}
                      >
                        <Input placeholder='answer6' />
                      </Form.Item>

                      <Form.Item
                        name={[field2.name, 'isCorrect6']}
                        valuePropName='checked'
                        noStyle
                        initialValue={false}
                      >
                        <Checkbox>Correct</Checkbox>
                      </Form.Item>

                      <MinusCircleOutlined
                        onClick={() => remove(field2.name)}
                      />
                    </Space>
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type='default'
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          {/* <Form.Item
                      {...field}
                      name={[field.name, 'question']}
                      fieldKey={[field.fieldKey, 'question']}
                      rules={[{ required: true, message: 'Missing qustion' }]}
                    >
                      <Input placeholder='Question' />
                    </Form.Item> */}

          {/* <MinusCircleOutlined onClick={() => remove(field.name)} /> */}
          {/* </Space>
                ))}
                <Form.Item>
                  <Button
                    type='dashed'
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List> */}
          {button()}
        </Form>
      )}
    </>
  )
}
