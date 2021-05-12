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
    sorter: (a, b) => {
      return a.tag.localeCompare(b.tag)
    },
  },
  {
    title: 'Success Rate',
    dataIndex: 'successRate',
    key: 'successRate',
    sorter: (a, b) => {
      return a.successRate.localeCompare(b.successRate)
    },
  },
  {
    title: 'Total',
    dataIndex: 'totalAnswers',
    key: 'totalAnswers',
    sorter: {
      compare: (a, b) => a.totalAnswers - b.totalAnswers,
    },
  },
]

function Answers() {
  const auth = useContext(AuthContext)
  const { isLoading, sendRequest } = useHttpClient()
  const [loadedAnswers, setLoadedAnswers] = useState()
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

        let realAnswer = []
        let correctAnswer = []
        let tags = []

        responseData.data.theQuiz.forEach((array) => {
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

        let total = []
        let rate = []
        for (let i = 0; i < correctAnswer.length; i++) {
          const filteredArray = correctAnswer[i].filter((value) =>
            realAnswer[i].includes(value)
          )
          total.push(correctAnswer[i].length)
          rate.push((filteredArray.length / correctAnswer[i].length) * 100)
        }

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
              let tag = uniqueTags[j]
              let successRate = rate[i] + '%'
              let totalAnswers = total[i]
              let key = i
              let index = { key, tag, successRate, totalAnswers }
              indexes.push(index)
            }
          }
          indices.push(indexes)
        }

        console.log('indices. ', indices)

        let data = []

        indices.forEach((el) => {
          if (!duplicates.includes(el[0].tag)) {
            console.log('matai mare', el[0])
            data.push(el[0])
          }
        })

        duplicates.forEach((tag) => {
          let successRate = 0
          let total = 0
          let duplicateEl
          indices.forEach((el) => {
            if (duplicates.includes(el[0].tag)) {
              if (tag === el[0].tag) {
                const nr = el[0].successRate.slice(0, -1)
                successRate += parseInt(nr)
                total += el[0].totalAnswers
                duplicateEl = el[0]
              }
            }
          })
          duplicateEl.successRate = (successRate / (total * 50)) * 100 + '%'
          duplicateEl.totalAnswers = total
          data.push(duplicateEl)
        })
        console.log('dataaa', data)
        setTableDataSource(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendRequest])

  return (
    <>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}

      {!isLoading && loadedAnswers && (
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
              <Table columns={columns} dataSource={tableDataSource} />
              <p>doinea</p>
            </>
          )}
        </>
      )}
    </>
  )
}

export default Answers
