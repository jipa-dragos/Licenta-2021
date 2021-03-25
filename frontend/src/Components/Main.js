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
          footer={null}
          onCancel={handleCancel}
        >
          <Link to='/auth/professor' onClick={handleCancel}>
            <Buttonski style={{ marginLeft: '30%', width: 180, backgroundColor: '#7f00ff', color: 'white' }}>
              Professor Authentication
            </Buttonski>
          </Link>
          <br />
          <br />
          <Link to='/auth/student' onClick={handleCancel}>
            <Buttonski type='primary' style={{ marginLeft: '30%', width: 180, backgroundColor: '#ff0080' }}>
              Student Authentication
            </Buttonski>
          </Link>
        </Modal>
      </div>
    </div>
  )
}

export default Main
