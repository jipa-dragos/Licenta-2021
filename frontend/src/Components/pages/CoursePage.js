import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'

function CoursePage() {
  const course = useParams()
  const auth = useContext(AuthContext)
  const [loadedCourse, setLoadedCourse] = useState()
  const { isLoading, sendRequest } = useHttpClient()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5005/api/course/${course.title}`,
          'GET',
          null,
          {
            Authorization: `Bearer ${auth.token}`,
          }
        )
        setLoadedCourse(responseData)
      } catch (err) {
        console.log(err)
      }
    }
    fetchCourse()

  }, [sendRequest, auth.token, course.title])

  return (
    <>
      {!isLoading && loadedCourse && (
        <div>
          {console.log(loadedCourse.data)}
          Title: {loadedCourse.data.title}
          <br/>
          Description: {loadedCourse.data.description}
        </div>
      )}
    </>
  )
}

export default CoursePage
