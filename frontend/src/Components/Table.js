import React, { useEffect, useState } from 'react'
import { useHttpClient } from '../shared/hooks/http-hook'
import { Table, Input, Button, Space, Statistic, Card, Row, Col } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import './Table.css'
import 'antd/dist/antd.css'
import { SearchOutlined } from '@ant-design/icons'
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
        return a.successRate.localeCompare(b.successRate)
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
        {tableDataSource && (
          <>
            <Table columns={columns} dataSource={tableDataSource} />
          </>
        )}
      </div>
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
                  suffix={`Total answers ${highest[1]}`}
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
                  suffix={`Total answers ${lowest[1]}`}
                />
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </>
  )

  function TableData(responseData) {
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
            total += el[0].totalAnswers
            duplicateEl = el[0]
          }
        }
      })
      duplicateEl.successRate = (successRate / (total * 50)) * 100 + '%'
      duplicateEl.totalAnswers = total
      data.push(duplicateEl)
    })

    setTableDataSource(data)

    const max = data.sort(
      (a, b) => parseInt(b.successRate) - parseInt(a.successRate)
    )[0]
    const min = data.sort(
      (a, b) => parseInt(a.successRate) - parseInt(b.successRate)
    )[0]

    setHighest([max.tag, max.totalAnswers])
    setLowest([min.tag, min.totalAnswers])
  }
}

export default TableComponent
