import React, { useState } from 'react'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { Redirect } from 'react-router'
import { useHistory } from 'react-router-dom'
import { useHttpClient } from '../../shared/hooks/http-hook'
import 'antd/dist/antd.css'
import { Form, Input, Select, Button } from 'antd'

const layout = {
  labelCol: {
    span: 8,
  },
}

function CreateCoursePage() {
  const { isLoading, sendRequest } = useHttpClient()
  const [redirect, setRedirect] = useState(false)
  let history = useHistory()
  const onFinish = (values) => {
    console.log(values)

    const createCourse = async () => {
      try {
        await sendRequest(
          'http://localhost:5005/api/course/',
          'POST',
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
    createCourse()
  }
  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}

      {!isLoading && (
        <Form {...layout} name='nest-messages' onFinish={onFinish} style={{ marginTop: '10%'}}>
          <Form.Item
            name={['course', 'title']}
            label='title'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input style={{ width: '50%' }}/>
          </Form.Item>
          <Form.Item
            name={['course', 'description']}
            label='description'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input style={{ width: '50%' }}/>
          </Form.Item>
          <Form.Item
            name={['course', 'type']}
            label='type'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select style={{ width: '50%' }}>
              <Select.Option value='course'>course</Select.Option>
              <Select.Option value='lab'>lab</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name={['course', 'year']}
            label='year'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select style={{ width: '50%' }}>
              <Select.Option value='I'>I</Select.Option>
              <Select.Option value='II'>II</Select.Option>
              <Select.Option value='III'>III</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name={['course', 'semester']}
            label='semester'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select style={{ width: '50%' }}>
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

export default CreateCoursePage
