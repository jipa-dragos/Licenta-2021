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

    console.log(responseData.data)
  }
}

export default TableComponent
