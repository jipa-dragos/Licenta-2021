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
              text='A data structure is a particular way of organizing data in a computer so that it can be used effectively.              '
              label='SDD'
              path='/courses'
            />

            <CardItem
              src='https://www.jrebel.com/sites/rebel/files/image/2020-05/image-blog-revel-top-java-tools.jpg'
              text='Java is one of the most popular and widely used programming language.'
              label='Java'
              path='/courses'
            />
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Cards
