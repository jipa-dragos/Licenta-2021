import React, { useState, useEffect, useContext } from 'react'
import './Courses.css'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { Row, Col } from 'antd'
import { Card } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'

const { Meta } = Card

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
        <>
          {auth.role && (
            <Link to='/create/course'>
              <Button
                shape='round'
                type='primary'
                size='large'
                style={{ marginLeft: '46%', marginTop: '3%' }}
              >
                Create a course
              </Button>
            </Link>
          )}
          <div id='feature' className='block featureBlock bgGray'>
            <div className='container-fluid'>
              <div className='titleHolder'>
                <h2>List of Courses</h2>
                <p>These are all the courses that you have access to!</p>
              </div>
              <Row gutter={[16, 16]}>
                {loadedCourses.data.map((course) => (
                  <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
                    <Link to={`/courses/${course.title}`}>
                      <Card
                        hoverable
                        cover={
                          <img alt={course.title} src='/images/bgcourses.png' />
                        }
                      >
                        <Meta title={course.title} />
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </>
      )}
    </>
  )
}
