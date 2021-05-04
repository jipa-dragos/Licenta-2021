import React, { useEffect, useState } from 'react'
import { useParams, Redirect } from 'react-router'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { useHistory } from 'react-router-dom'
import 'antd/dist/antd.css'
import { Form, Input, Select, Button } from 'antd'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

function UpdateCourse() {
  const [loadedCourse, setLoadedCourse] = useState()
  const { id } = useParams()
  const { isLoading, sendRequest } = useHttpClient()
  const [redirect, setRedirect] = useState(false)
  let history = useHistory()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5005/api/course/One/${id}`
        )
        setLoadedCourse(responseData)
      } catch (err) {
        console.log(err)
      }
    }
    fetchCourse()
  }, [sendRequest, id])

  const onFinish = (values) => {
      console.log(values)
      console.log(id)
      const updateCourse = async () => {
        try {
          await sendRequest(
            `http://localhost:5005/api/course/${id}`,
            'PATCH',
            JSON.stringify({
              title: values.course.title,
              description: values.course.description,
              type: values.course.type,
              year: values.course.year,
              semester: values.course.semester,
            })
          )
          setRedirect(true)
        } catch (err) {}
      }
      updateCourse()
  
  }

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedCourse && (
        <Form {...layout} name='nest-messages' onFinish={onFinish}>
          <Form.Item
            name={['course', 'title']}
            label='title'
            initialValue={loadedCourse.data.title}
          >
            <Input
            />
          </Form.Item>
          <Form.Item
            name={['course', 'description']}
            label='description'
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={loadedCourse.data.description}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['course', 'type']}
            label='type'
            initialValue={loadedCourse.data.type}
          >
            <Select >
              <Select.Option value='course'>course</Select.Option>
              <Select.Option value='lab'>lab</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name={['course', 'year']}
            label='year'
            initialValue={loadedCourse.data.year}
          >
            <Select >
              <Select.Option value='I'>I</Select.Option>
              <Select.Option value='II'>II</Select.Option>
              <Select.Option value='III'>III</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name={['course', 'semester']}
            label='semester'
            initialValue={loadedCourse.data.semester}
          >
            <Select >
              <Select.Option value='I'>I</Select.Option>
              <Select.Option value='II'>II</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
      {redirect && <Redirect to={{ pathname: history.goBack() }} />}
    </>
  )
}

export default UpdateCourse
