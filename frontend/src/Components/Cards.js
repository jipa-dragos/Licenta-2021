import React from 'react'
import CardItem from './CardItem'
import './Cards.css'

function Cards() {
  return (
    <div className='cards'>
      <h1>Quizes for the subjects</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='https://s3.amazonaws.com/coursesity-blog/2020/07/data-structure-algorithm-courses.png'
              text='Explore the hidden waterfall deep inside the Amazon Jungle'
              label='SDD'
              path='/services'
            />

            <CardItem
              src='https://www.jrebel.com/sites/rebel/files/image/2020-05/image-blog-revel-top-java-tools.jpg'
              text='Travel through the islands of bali in a private cruise'
              label='Java'
              path='/services'
            />
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Cards
