import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { AuthContext } from '../shared/context/auth-context'
import { Button } from './Button'
import './Main.css'
import { Modal, Button as Buttonski } from 'antd'
import 'antd/dist/antd.css'

function Main() {
  const auth = useContext(AuthContext)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [click] = useState(false)

  const showModal = () => {
    setIsModalVisible(!click)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
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

        <Modal
          title='Authentication needed!'
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Link to='/auth/professor' onClick={handleOk}>
            <Buttonski style={{ marginLeft: '30%', width: 180, backgroundColor: '#7f00ff', color: 'white' }}>
              Professor Authentication
            </Buttonski>
          </Link>
          <br />
          <br />
          <Link to='/auth/student' onClick={handleOk}>
            <Buttonski type='primary' style={{ marginLeft: '30%', width: 180, backgroundColor: '#ff0080' }}>
              Student Authentication
            </Buttonski>
          </Link>
        </Modal>

        {auth.role && (
          <Button
            className='btns'
            buttonSize='btn--large'
            buttonStyle='btn--primary'
          >
            <Link
              to='/quiz'
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              Ne mai vedem
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export default Main
