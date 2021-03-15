import React, { useContext } from 'react'
import '../App.css'
import { AuthContext } from '../shared/context/auth-context'
import { Button } from './Button'
import './Main.css'

function Main() {
  const auth = useContext(AuthContext)

  return (
    <div className='hero-container'>
    <h1>ASE QUIZ IS HERE</h1>
    <div className='hero-btns'>
    { !auth.isLoggedIn && <Button
        className='btns'
        buttonSize='btn--large'
        buttonStyle='btn--outline'
      >
        GET STARTED
      </Button> }
     
      <Button
        className='btns'
        buttonSize='btn--large'
        buttonStyle='btn--primary'
      >
        Ne mai vedem
      </Button>
    </div>
  </div>

  )
}

export default Main
