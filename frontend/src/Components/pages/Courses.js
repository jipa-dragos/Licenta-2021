import React, { useState, useEffect, useContext } from 'react'
import './Courses.css'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { Link } from 'react-router-dom'
import { Row, Col, Card, Button, Input } from 'antd'
import { MinusCircleOutlined, EditOutlined } from '@ant-design/icons'
import Modal from 'antd/lib/modal/Modal'

const { Meta } = Card

export default function Courses() {
  const auth = useContext(AuthContext)
  const [loadedCourses, setLoadedCourses] = useState()
  const { isLoading, sendRequest } = useHttpClient()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [id, setId] = useState()
  const [courseTitle, setCourseTitle] = useState()
  const [accessCode, setAccessCode] = useState(null)
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

  const showModal = (e) => {
    setIsModalVisible(true)
    setId(e.currentTarget.getAttribute('id'))
    setCourseTitle(e.currentTarget.getAttribute('title'))
  }

  const inputEl = (e) => {
    e.target.value === courseTitle ? setDisabled(false) : setDisabled(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  async function fetchCourse() {
    const responseData = await sendRequest('http://localhost:5005/api/course/')
    setLoadedCourses(responseData)
  }

  const handleDelete = () => {
    setIsModalVisible(false)

    const deleteCourse = async () => {
      try {
        await sendRequest(`http://localhost:5005/api/course/${id}`, 'DELETE')

        await fetchCourse()
      } catch (err) {
        console.log(err)
      }
    }

    deleteCourse()
  }

  const handleMouseEnter = (e) => {
    const el = e.currentTarget.getAttribute('id')
    setAccessCode(el)
  }

  useEffect(() => {
    if (accessCode != null) {
      setTimeout(function () {
        window.prompt('Copy to clipboard: Ctrl+C, Enter', accessCode)
      }, 2000)
    }
  }, [accessCode])

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {auth.role && (
        <div
          style={{
            marginTop: '3%',
            textAlign: 'center',
          }}
        >
          <Link to='/create/course'>
            <Button shape='round' type='primary' size='large'>
              Create a course
            </Button>
          </Link>
        </div>
      )}
      {!isLoading && loadedCourses && (
        <>
          <div id='feature' className='block featureBlock bgGray'>
            <div className='container-fluid'>
              <div className='titleHolder'>
                <h2>List of Courses</h2>
                <p>These are all the courses that you have access to!</p>
              </div>
              <Row gutter={[16, 16]}>
                {loadedCourses.data.map((course, i) => {
                  return (
                    <Col
                      xs={{ span: 24 }}
                      sm={{ span: 12 }}
                      md={{ span: 8 }}
                      key={i}
                    >
                      {auth.role && (
                        <Row>
                          <Col>
                            <MinusCircleOutlined
                              id={course._id}
                              title={course.title}
                              onClick={showModal}
                            />
                          </Col>
                          <Col push={20}>
                            <Link to={`/update/course/${course._id}`}>
                              <EditOutlined
                                style={{ marginLeft: '85%' }}
                                id={course._id}
                                title={course.title}
                              />
                            </Link>
                          </Col>
                        </Row>
                      )}

                      <Link to={`/courses/${course.title}`}>
                        <Card
                          hoverable
                          cover={
                            <img
                              alt={course.title}
                              src='/images/bgcourses.png'
                            />
                          }
                          id={course.accessCode}
                          onMouseEnter={handleMouseEnter}
                        >
                          <Meta
                            title={course.title}
                            description={course.accessCode}
                          />
                        </Card>
                      </Link>
                    </Col>
                  )
                })}
              </Row>
            </div>
          </div>

          <Modal
            title='Delete Course'
            visible={isModalVisible}
            footer={
              <>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button disabled={disabled} danger onClick={handleDelete}>
                  Delete
                </Button>
              </>
            }
            onCancel={handleCancel}
          >
            <h3>
              All the quizzes related to this course, and also the respective
              answers will be deleted!
            </h3>
            <p>To delete the course, type the course name to confirm.</p>
            <Input onChange={inputEl} />
          </Modal>
        </>
      )}
    </>
  )
}
