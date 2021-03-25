import React, { useState, useEffect, useContext } from 'react'
import '../../App.css'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import CardItem from '../CardItem'

export default function Courses() {
  const auth = useContext(AuthContext)
  const [loadedCourses, setLoadedCourses] = useState()
  const { isLoading, sendRequest } = useHttpClient()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/course/'
        )
        setLoadedCourses(responseData)
      } catch (err) {
        console.log(err)
      }
    }
    fetchCourses()
  }, [sendRequest, auth.token])
  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedCourses && (
        <div className='cards'>
          <h1>List of courses</h1>
          <div className='cards__container'>
            <div className='cards__wrapper'>
              <ul className='cards__items'>
                {loadedCourses.data.map((course) => (
                  <CardItem
                    src='/images/bgcourses.png'
                    text={course.description}
                    label={course.title}
                    path={`/courses/${course.title}`}
                    key={course._id}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
