import React from 'react'
import './Footer.css'
function Footer() {
  return (
    <div className='footer-container'>
      <div className='social-media-wrap'>
        <div className='footer-logo'>
          <p to='/' className='social-logo' >
            ASE QUIZ <i className='fab fa-typo3' />
          </p>
        </div>
        <small className='website-rights'>ASE QUIZ @ 2021</small>
      </div>
    </div>
  )
}

export default Footer
