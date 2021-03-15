import React from 'react'
import './Popup.css'

function Popup(props) {
    return (props.trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <span className='close-X' onClick={() => props.setTrigger(false)}>X</span>
                { props.children }
            </div>
        </div>
    ) : ''
}

export default Popup
