import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { AuthContext } from '../shared/context/auth-context'
import { Button } from './Button'
import './Main.css'
import { Modal, Button as Buttonski, Input, Form } from 'antd'
import 'antd/dist/antd.css'

function Main() {
  const auth = useContext(AuthContext)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isAccessModalVisible, setIsAccessModalVisible] = useState(false)
  const [click] = useState(false)

  const showModal = () => {
    setIsModalVisible(!click)
  }
  const accessCode = () => {
    setIsAccessModalVisible(!click)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setIsAccessModalVisible(false)
  }

  const onFinishQuiz = (values) => values

  const onFinishCourse = (values) => {
    console.log('Success:', values)
  }

  return (
    <div className='hero-container'>
      <h1>ASE QUIZ IS HERE</h1>
      <div className='hero-btns'>
        {!auth.isLoggedIn && (
          <Button
            className='btns'
            buttonSize='btn--large'
            buttonStyle='btn--outline'
            onClick={showModal}
          >
            GET STARTED
          </Button>
        )}
        {auth.isLoggedIn && !auth.role && (
          <Button
            className='btns'
            buttonSize='btn--large'
            buttonStyle='btn--outline'
            onClick={accessCode}
          >
            Get Access
          </Button>
        )}

        <Modal
          title='Get Access'
          visible={isAccessModalVisible}
          footer={null}
          onCancel={handleCancel}
        >
          <Form
            layout='inline'
            name='course'
            initialValues={{
              remember: true,
            }}
            onFinish={onFinishCourse}
          >
            <Form.Item label='Course' name='accessCode'>
              <Input placeholder='Course access code' style={{width: '55%'}}/>
            </Form.Item>

            <Form.Item>
              <Buttonski
                type='primary'
                htmlType='submit'
              >
                Join Course
              </Buttonski>
            </Form.Item>
          </Form>
          <br />
          <Form
            name='quiz'
            layout='inline'
            initialValues={{
              remember: true,
            }}
            onFinish={onFinishQuiz}
          >
            <Form.Item label='Quiz' name='accessCode' style={{paddingLeft: 25}}>
              <Input placeholder='Quiz access code' style={{width: '55%'}}/>
            </Form.Item>

            <Form.Item>
            <Link to={`/courses/WEBTECH/quiz/${onFinishQuiz}`}>
              <Buttonski
                type='primary'
                htmlType='submit'
                style={{width: '115%'}}
              >
                Start Quiz
              </Buttonski>
              </Link>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title='Authentication needed!'
          visible={isModalVisible}
          footer={null}
          onCancel={handleCancel}
        >
          <Link to='/auth/professor' onClick={handleCancel}>
            <Buttonski
              style={{
                marginLeft: '30%',
                width: 180,
                backgroundColor: '#7f00ff',
                color: 'white',
              }}
            >
              Professor Authentication
            </Buttonski>
          </Link>
          <br />
          <br />
          <Link to='/auth/student' onClick={handleCancel}>
            <Buttonski
              type='primary'
              style={{
                marginLeft: '30%',
                width: 180,
                backgroundColor: '#ff0080',
              }}
            >
              Student Authentication
            </Buttonski>
          </Link>
        </Modal>
      </div>
    </div>
  )
}

export default Main
