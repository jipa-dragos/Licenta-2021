import React, { useState, useContext } from 'react'
import '../../App.css'
import Card from '../../shared/components/UI/Cards'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import Button from '../../shared/components/FormElements/Button'
import './Auth.css'
import { useForm } from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { Form, Input as Inp, Button as Buttonski } from 'antd'
import { UserOutlined, LockOutlined, BankOutlined, AliwangwangOutlined, GroupOutlined, InsertRowAboveOutlined, ItalicOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css'

export default function SignUp() {
  const auth = useContext(AuthContext)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const { isLoading, sendRequest } = useHttpClient()

  const [formState, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  )

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          faculty: undefined,
          series: undefined, 
          year: undefined,
          group: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      )
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          faculty: {
            value: '',
            isValid: false,
          },
          series: {
            value: '',
            isValid: false,
          }, 
          year: {
            value: '',
            isValid: false,
          },
          group: {
            value: '',
            isValid: false,
          }
        },
        false
      )
    }
    setIsLoginMode((prevMode) => !prevMode)
  }

  const onFinish = async (values) => {
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/auth/login/student',
          'POST',
          JSON.stringify({
            email: values.email,
            password: values.password,
          }),
          {
            'Content-Type': 'application/json',
          }
        )
        auth.login(responseData.studentId, responseData.token)
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/auth/signup/student',
          'POST',
          JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
            faculty: values.faculty,
            series: values.series,
            year: values.year,
            group: values.group,
          }),
          {
            'Content-Type': 'application/json',
          }
        )
        auth.login(responseData.studentId, responseData.token)

        console.log(responseData)
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <>
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <Form
          name='normal_login'
          className='login-form'
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          {!isLoginMode && (
            <>
              <Form.Item
                wrapperCol={{
                  offset: 4,
                }}
                name='name'
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please input your name!',
                  },
                ]}
              >
                <Inp
                  prefix={<AliwangwangOutlined className='site-form-item-icon' />}
                  placeholder='Your name'
                />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 4,
                }}
                name='faculty'
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please input your faculty!',
                  },
                ]}
              >
                <Inp
                  prefix={<BankOutlined className='site-form-item-icon' />}
                  placeholder='Faculty'
                />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 4,
                }}
                name='series'
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please input your series!',
                  },
                ]}
              >
                <Inp
                  prefix={<InsertRowAboveOutlined className='site-form-item-icon' />}
                  placeholder='series'
                />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 4,
                }}
                name='year'
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please input your year!',
                  },
                ]}
              >
                <Inp
                  prefix={<ItalicOutlined className='site-form-item-icon' />}
                  placeholder='year'
                />
              </Form.Item>
              
              <Form.Item
                wrapperCol={{
                  offset: 4,
                }}
                name='group'
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please input your group!',
                  },
                ]}
              >
                <Inp
                  prefix={<GroupOutlined className='site-form-item-icon' />}
                  placeholder='group'
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            name='email'
            wrapperCol={{
              offset: 4,
            }}
            hasFeedback
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please input your email!',
              },
            ]}
          >
            <Inp
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Email'
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 4,
            }}
            name='password'
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Inp
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 4,
            }}
          >
            <Buttonski
              type='primary'
              htmlType='submit'
              className='login-form-button'
            >
              Log in
            </Buttonski>
          </Form.Item>
        </Form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </>
  )
}
