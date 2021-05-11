import React, { useContext, useEffect, useState } from 'react'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { List, Avatar, Divider, Table, Tag } from 'antd'
import 'antd/dist/antd.css'

const columns = [
  {
    title: 'Tag',
    dataIndex: 'tag',
    key: 'tag',
    width: '30%',
    sorter: (a, b) => {
      return a.tag.localeCompare(b.tag)
    },
  },
  {
    title: 'Success Rate',
    dataindex: 'successRate',
    key: 'successRate',
    width: '30%',
  },
  {
    title: 'Total Answers',
    dataindex: 'totalAnswers',
    key: 'totalAnswers',
    width: '30%',
  },
]

function Answers() {
  const auth = useContext(AuthContext)
  const { isLoading, sendRequest } = useHttpClient()
  const [loadedAnswers, setLoadedAnswers] = useState()
  const [data, setData] = useState()
  const [tableDataSource, setTableDataSource] = useState([])

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/answer/'
        )
        setLoadedAnswers(responseData.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchAnswers()
  }, [sendRequest, auth.token])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/answer/stats'
        )
        console.log(responseData)
        setData(responseData.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchStats()
  }, [sendRequest, auth.token])

  useEffect(() => {
    if (data) {
      let realAnswer = []
      let correctAnswer = []
      let tags = []

      data.theQuiz.forEach((array) => {
        array.answers.forEach((element) => {
          realAnswer.push(element)
        })
        array.correctAnswers.forEach((element) => {
          correctAnswer.push(element)
        })
        array.tags.forEach((element) => {
          tags.push(element)
        })
      })

      // console.log(realAnswer)
      // console.log(correctAnswer)
      // console.log(tags)

      let total = []
      let rate = []
      for (let i = 0; i < correctAnswer.length; i++) {
        const filteredArray = correctAnswer[i].filter((value) =>
          realAnswer[i].includes(value)
        )
        // console.log('filteredarray', filteredArray.length)
        // console.log('correctanswers', correctAnswer[i].length)
        total.push(correctAnswer[i].length)
        rate.push((filteredArray.length / correctAnswer[i].length) * 100)
      }
      // console.log(rate)
      // console.log(total)

      const duplicates = tags.reduce(function (acc, el, i, arr) {
        if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el)
        return acc
      }, [])

      console.log('duplicates for real:', duplicates)

      let uniqueTags = [...new Set(tags)]
      let indices = []
      for (let i = 0; i < tags.length; i++) {
        let indexes = []
        for (let j = 0; j < uniqueTags.length; j++) {
          if (tags[i] === uniqueTags[j]) {
            // console.log(index)
            // indexes.push(i)
            // indexes.push(index)
            // indexes.push(uniqueTags[j])
            // indexes.push(rate[i])
            // indexes.push(total[i])
            let tag = uniqueTags[j]
            let successRate = rate[i]
            let totalAnswers = total[i]
            let index = { i, tag, successRate, totalAnswers }
            indexes.push(index)
          }
        }
        // console.log(indexes)
        indices.push(indexes)
      }
      // console.log(indices)

      duplicates.forEach((tag) => {
        // console.log(tag)
        indices.forEach((el) => {
          // console.log(el[0].tag)
          if (tag !== el[0].tag) {
            setTableDataSource([...tableDataSource, el[0]])
          }
        })
      })
    }
  }, [data])
  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}

      {!isLoading && loadedAnswers && data && (
        <>
          <List
            itemLayout='horizontal'
            dataSource={loadedAnswers}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src='/images/quizicon.png' />}
                  title={<p style={{ fontSize: 20 }}>{item.title}</p>}
                  description={
                    <>
                      <h2>Course: {item.courseName}</h2>
                      <h2>grade: {item.grades}</h2>

                      <Divider orientation='left'>
                        <Tag color='gold'>Questions</Tag>
                      </Divider>

                      <List
                        size='default'
                        bordered
                        dataSource={item.questions}
                        renderItem={(item, index) => (
                          <List.Item>
                            {index + 1}. {item}
                          </List.Item>
                        )}
                      />
                      <Divider orientation='left'>
                        <Tag color='#f50'>Tags</Tag>
                      </Divider>

                      <List
                        size='default'
                        bordered
                        dataSource={item.tags}
                        renderItem={(item, index) => (
                          <List.Item>
                            {index + 1}. {item}
                          </List.Item>
                        )}
                      />

                      <Divider orientation='left'>
                        <Tag color='gold'>Sent answers</Tag>
                      </Divider>
                      <List
                        size='default'
                        bordered
                        dataSource={item.answers}
                        renderItem={(item, index) => (
                          <List.Item>
                            {index + 1}. {item}
                          </List.Item>
                        )}
                      />
                      <Divider orientation='left'>
                        <Tag color='purple'>Correct Answers</Tag>
                      </Divider>
                      <List
                        size='default'
                        bordered
                        dataSource={item.correctAnswers}
                        renderItem={(item, index) => (
                          <List.Item key={index}>
                            {index + 1}. {item}
                          </List.Item>
                        )}
                      />
                    </>
                  }
                />
              </List.Item>
            )}
          />

          {tableDataSource && (
            <>
              {console.log('table ', tableDataSource)}
              <Table
                rowKey={(tableDataSource) => tableDataSource.i}
                columns={columns}
                dataSource={tableDataSource}
              />
            </>
          )}
        </>
      )}
    </>
  )
}

export default Answers
