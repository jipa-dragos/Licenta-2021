import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { Link } from 'react-router-dom'

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
          Title: {loadedCourse.data.title}
          <br />
          Type: {loadedCourse.data.type}
          <br />
          Description: {loadedCourse.data.description}
          <br />
          {loadedCourse.quiz.map((quiz, index) => (
            <React.Fragment key={index}>
              {new Date(quiz.startDate).getTime() < Date.now() && (
                <Link to={`/quiz/${quiz._id}`} key={index}>
                  <h3 key={quiz._id}>{quiz.title}</h3>
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  )
}

export default CoursePage
