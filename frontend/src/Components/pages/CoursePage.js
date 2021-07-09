import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { Link } from 'react-router-dom'

function CoursePage() {
  const course = useParams()
  const auth = useContext(AuthContext)
  const [loadedCourse, setLoadedCourse] = useState()
  const [loadedIds, setLoadedIds] = useState()
  const { isLoading, sendRequest } = useHttpClient()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5005/api/course/${course.title}`
        )
        setLoadedCourse(responseData)
      } catch (err) {
        console.log(err)
      }
    }
    const fetchAnswers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5005/api/answer/courseName/${course.title}`
        )
        let ids = []
        for (let i of responseData.data) {
          ids.push(i.quiz)
        }

        setLoadedIds(ids)
      } catch (err) {
        console.log(err)
      }
    }
    fetchCourse()
    fetchAnswers()
  }, [sendRequest, auth.token, course.title])

  return (
    <>
      {!isLoading && loadedCourse && loadedIds && (
        <div>
          <h1>Title: {loadedCourse.data.title}</h1>
          <h2>Type: {loadedCourse.data.type}</h2>
          <h3>Description: {loadedCourse.data.description}</h3>
          <p>Quizzes for this course:</p>
          {loadedCourse.quiz.map((quiz, index) => (
            <React.Fragment key={index}>
              {
                !loadedIds.includes(quiz._id) &&
                !auth.role &&
                (
                  <Link to={`/quiz/${quiz._id}`} key={index}>
                    <h3 key={quiz._id}>{quiz.title}</h3>
                  </Link>
                )}

              {auth.role && !loadedIds.includes(quiz._id) && <h3 key={quiz._id}>{quiz.title}</h3>}
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  )
}

export default CoursePage
