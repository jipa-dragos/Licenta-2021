import React, { useState, useEffect, useContext } from 'react'
import { Button } from './Button'
import Popup from './pages/Popup'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { AuthContext } from '../shared/context/auth-context'

function Navbar() {
  const auth = useContext(AuthContext)
  const [click, setClick] = useState(false)
  const [button, setButton] = useState(true)
  const [buttonPopup, setButtonPopup] = useState(false)

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
    setButtonPopup(true)
    closeMobileMenu()
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
            <li className='nav-item' style={{marginTop:16}}>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item' style={{marginTop:16}}>
              <Link
                to='/courses'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Courses
              </Link>
            </li>
            <li className='nav-item' style={{marginTop:16}}>
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
              onClick={() => {
                setButtonPopup(true)
              }}
              buttonStyle='btn--outline'
            >
              Auth
            </Button>
          )}
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            <h3>Authentication needed!</h3>
            <br></br>
            <br></br>
            <Link to='/auth/student'>
              <Button onClick={() => setButtonPopup(false)}>
                Student Authentication
              </Button>
            </Link>
            <br></br>
            <br></br>
            <Link to='/auth/professor'>
              <Button onClick={() => setButtonPopup(false)}>Professor Authentication</Button>
            </Link>
          </Popup>
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
