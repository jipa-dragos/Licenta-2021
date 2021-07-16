import React, { useEffect, useState } from 'react'
import { useHttpClient } from '../shared/hooks/http-hook'
import { Table, Input, Button, Space, Statistic, Card, Row, Col } from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import './Table.css'
import 'antd/dist/antd.css'
import Highlighter from 'react-highlight-words'

function TableComponent() {
  const { sendRequest } = useHttpClient()
  const [tableDataSource, setTableDataSource] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [highest, setHighest] = useState([])
  const [lowest, setLowest] = useState([])

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 0 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/answer/stats'
        )
        TableData(responseData)
      } catch (err) {
        console.log(err)
      }
    }
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendRequest])

  const columns = [
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      sorter: (a, b) => {
        return a.tag.localeCompare(b.tag)
      },
      ...getColumnSearchProps('tag'),
    },
    {
      title: 'Success Rate',
      dataIndex: 'successRate',
      key: 'successRate',
      sorter: (a, b) => {
        return parseInt(a.successRate) - parseInt(b.successRate)
      },
      ...getColumnSearchProps('successRate'),
    },

    {
      title: 'Total',
      dataIndex: 'totalAnswers',
      key: 'totalAnswers',
      sorter: {
        compare: (a, b) => a.totalAnswers - b.totalAnswers,
      },
      ...getColumnSearchProps('totalAnswers'),
    },
  ]

  return (
    <>
      <div>
        {tableDataSource.length !== 0 && (
          <>
            <Table columns={columns} dataSource={tableDataSource} />
          </>
        )}
      </div>
      <>
        {tableDataSource.length !== 0 && (
          <div className='site-statistic-demo-card'>
            {highest && lowest && (
              <Row gutter={16}>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title='Best'
                      value={highest[0]}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      prefix={<ArrowUpOutlined />}
                      suffix={`Correct Answers ${highest[1]} out of ${highest[2]}`}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title='Worst'
                      value={lowest[0]}
                      precision={2}
                      valueStyle={{ color: '#cf1322' }}
                      prefix={<ArrowDownOutlined />}
                      suffix={`Correct Answers ${lowest[1]} out of ${lowest[2]}`}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        )}
      </>
    </>
  )

  function TableData(responseData) {
    if (!responseData.data) return

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

    let rate = []

    for (let i = 0; i < correctAnswer.length; i++) {
      const filteredArray = correctAnswer[i].filter((value) =>
        realAnswer[i].includes(value)
      )
      if (filteredArray.length === correctAnswer[i].length) {
        if (correctAnswer[i].length === realAnswer[i].length) rate.push(100)
        else rate.push(0)
      } else rate.push(0)
    }

    const duplicates = tags.reduce(function (acc, el, i, arr) {
      if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el)
      return acc
    }, [])

    let uniqueTags = [...new Set(tags)]
    let indices = []
    for (let i = 0; i < tags.length; i++) {
      let indexes = []
      for (let j = 0; j < uniqueTags.length; j++) {
        if (tags[i] === uniqueTags[j]) {
          let tag = uniqueTags[j]
          let successRate = rate[i] + '%'
          let totalAnswers = 1
          let key = i
          let index = { key, tag, successRate, totalAnswers }
          indexes.push(index)
        }
      }
      indices.push(indexes)
    }

    let data = []
    indices.forEach((el) => {
      if (!duplicates.includes(el[0].tag)) {
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
            total += el.length
            duplicateEl = el[0]
          }
        }
      })
      duplicateEl.successRate = Math.round(successRate / total) + '%'
      duplicateEl.totalAnswers = total
      data.push(duplicateEl)
    })

    setTableDataSource(data)
    const max = data.sort(
      (a, b) => parseInt(b.successRate) - parseInt(a.successRate)
    )

    let maxNumber = -1
    let minNumber = 101
    for (const i of max) {
      if (parseInt(i.successRate.slice(0, -1)) > maxNumber) {
        maxNumber = parseInt(i.successRate)
      }
      if (parseInt(i.successRate.slice(0, -1)) < minNumber) {
        minNumber = parseInt(i.successRate)
      }
    }

    let trueMax = {
      key: null,
      tag: null,
      successRate: null,
      totalAnswers: null
    }
    
    let trueMin = {
      key: null,
      tag: null,
      successRate: null,
      totalAnswers: null
    }

    trueMax.successRate = maxNumber
    trueMin.successRate = minNumber

    let maxTotalAnswers = -1
    let maxTag 
    let maxKey
    let minTotalAnswers = -1
    let minTag 
    let minKey
    for (const i of max) {
      if (parseInt(i.successRate.slice(0, -1)) === maxNumber) {
        if (i.totalAnswers > maxTotalAnswers) {
          maxTotalAnswers = i.totalAnswers
          maxTag = i.tag
          maxKey = i.key
        }
      }

      if (parseInt(i.successRate.slice(0, -1)) === minNumber) {
        if (i.totalAnswers > minTotalAnswers) {
          minTotalAnswers = i.totalAnswers
          minTag = i.tag
          minKey = i.key
        }
      }
    }
    trueMax.totalAnswers = maxTotalAnswers
    trueMax.tag = maxTag
    trueMax.key = maxKey

    trueMin.totalAnswers = minTotalAnswers
    trueMin.tag = minTag
    trueMin.key = minKey

    const nrCorrectAnswHigh =
    trueMax.totalAnswers * (parseInt(trueMax.successRate) / 100)
    const nrCorrectAnswLow =
    trueMin.totalAnswers * (parseInt(trueMin.successRate) / 100)
    setHighest([trueMax.tag, Math.round(nrCorrectAnswHigh), trueMax.totalAnswers])
    setLowest([trueMin.tag, Math.round(nrCorrectAnswLow), trueMin.totalAnswers])
  }
}

export default TableComponent
