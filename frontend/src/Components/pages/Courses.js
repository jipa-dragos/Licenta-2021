import React, { useState, useEffect, useContext } from 'react'
import './Courses.css'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { Button, Input } from 'antd'
import { Link } from 'react-router-dom'
import { Row, Col } from 'antd'
import { Card } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import Modal from 'antd/lib/modal/Modal'

const { Meta } = Card

export default function Courses() {
  const auth = useContext(AuthContext)
  const [loadedCourses, setLoadedCourses] = useState()
  const { isLoading, sendRequest } = useHttpClient()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [id, setId] = useState()

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
  }

  const inputEl = (e) => {
    e.target.value === 'DELETE' ? setDisabled(false) : setDisabled(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    console.log(id)
  }

  const handleDelete = () => {
    setIsModalVisible(false)

    const deleteCourse = async () => {
      try {
        await sendRequest(`http://localhost:5005/api/course/${id}`, 'DELETE')
      } catch (err) {
        console.log(err)
      }
    }
    deleteCourse()
  }
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
                {loadedCourses.data.map((course, i) => {
                  return (
                    <Col
                      xs={{ span: 24 }}
                      sm={{ span: 12 }}
                      md={{ span: 8 }}
                      key={i}
                    >
                      <MinusCircleOutlined
                        id={course._id}
                        onClick={showModal}
                      />
                      <Link to={`/courses/${course.title}`}>
                        <Card
                          hoverable
                          cover={
                            <img
                              alt={course.title}
                              src='/images/bgcourses.png'
                            />
                          }
                        >
                          <Meta title={course.title} />
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
          >
            <h3>
              All the quizzes related to this course, and also the respective
              answers will be deleted!
            </h3>
            <p>To delete the course, type 'DELETE' to confirm.</p>
            <Input onChange={inputEl} />
          </Modal>
        </>
      )}
    </>
  )
}
