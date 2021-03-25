import React, { useState, useEffect, useContext } from 'react'
import { Button } from './Button'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { AuthContext } from '../shared/context/auth-context'
import { Modal, Button as Buttonski } from 'antd'
import 'antd/dist/antd.css'

function Navbar() {
  const auth = useContext(AuthContext)
  const [click, setClick] = useState(false)
  const [button, setButton] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleClick = () => setClick(!click)
  const closeMobileMenu = () => setClick(false)

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false)
    } else {
      setButton(true)
    }
  }

  useEffect(() => {
    showButton()
  }, [])

  window.addEventListener('resize', showButton)

  const handleClickMobile = (e) => {
    e.preventDefault()
    setIsModalVisible(true)
    closeMobileMenu()
  }

  const showModal = () => {
    setIsModalVisible(!click)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            ASE QUIZ
            <i className='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item' style={{ marginTop: 16 }}>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item' style={{ marginTop: 16 }}>
              <Link
                to='/courses'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Courses
              </Link>
            </li>
            <li className='nav-item' style={{ marginTop: 16 }}>
              <Link to='/quiz' className='nav-links' onClick={closeMobileMenu}>
                Quiz
              </Link>
            </li>

            <li>
              <p className='nav-links-mobile' onClick={handleClickMobile}>
                Auth
              </p>
            </li>
          </ul>
          {!auth.isLoggedIn && button && (
            <Button
              onClick={showModal}
              buttonStyle='btn--outline'
            >
              Auth
            </Button>
          )}

          <Modal
            title='Authentication needed!'
            visible={isModalVisible}
            footer={null}
            onCancel={handleCancel}
          >
            <Link to='/auth/professor' onClick={handleCancel}>
              <Buttonski type='primary' style={{ marginLeft: '30%', width: 180, color: 'white', backgroundColor: '#7f00ff'}}>
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
          {auth.isLoggedIn && button && (
            <Button buttonStyle='btn--outline' onClick={auth.logout}>
              Logout
            </Button>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
