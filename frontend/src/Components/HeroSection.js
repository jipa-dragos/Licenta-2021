import React from 'react'
import '../App.css'
import { Button } from './Button'
import './HeroSection.css'

function HeroSection() {
  return (
    <div className='hero-container'>
      <h1>ASE QUIZ IS HERE</h1>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonSize='btn--large'
          buttonStyle='btn--outline'
        >
          GET STARTED
        </Button>
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

export default HeroSection
