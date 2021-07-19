import React, { useContext, useState, useEffect } from 'react'
import { Redirect, useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import {
  Button,
  Col,
  Row,
  Statistic,
  Progress,
  Checkbox,
  Radio,
  Space,
} from 'antd'
import 'antd/dist/antd.css'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import Cards from '../../shared/components/UI/Cards'
import moment from 'moment'
import Canvas from './Canvas'

const { Countdown } = Statistic

function QuizPage() {
  const { id } = useParams()
  const auth = useContext(AuthContext)
  const [loadedQuestions, setLoadedQuestions] = useState()
  const { isLoading, sendRequest } = useHttpClient()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [lastQuestion, setLastQuestion] = useState(false)
  const [clickedAnswers, setClickedAnswers] = useState([])
  const [firstQuestion, setFirstQuestion] = useState(true)
  const [redirect, setRedirect] = useState(false)
  const [isMultipleChoice, setIsMultipleChoice] = useState()
  let history = useHistory()

  const path = `/quiz/${id}/result`

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/quiz/course/' + id
        )
        let quizExpirationDate = new Date(responseData.data.endDate)
        quizExpirationDate.setHours(quizExpirationDate.getHours() - 3)

        responseData.data.quizExpirationDate = quizExpirationDate
        responseData.data.isMultipleChoice = responseData.isMultipleChoice

        setIsMultipleChoice(responseData.isMultipleChoice[0])
        setLoadedQuestions(responseData.data)
      } catch (err) {
        setRedirect(true)
      }
    }
    fetchQuiz()
  }, [sendRequest, auth.token, id])

  const handleNextButtonClick = () => {
    if (clickedAnswers.length !== 0) {
      if (firstQuestion) {
        const sendAnswer = async () => {
          try {
            const constructArrayOfAnswers = [clickedAnswers]

            await sendRequest(
              'http://localhost:5005/api/answer/first/',
              'POST',
              JSON.stringify({
                answers: constructArrayOfAnswers,
                quiz: id,
              })
            )
          } catch (err) {}
        }
        sendAnswer()
        setFirstQuestion(false)
      } else {
        const sendAnswer = async () => {
          try {
            const constructArrayOfAnswers = [clickedAnswers]

            await sendRequest(
              'http://localhost:5005/api/answer/',
              'PATCH',
              JSON.stringify({
                answers: constructArrayOfAnswers,
                quiz: id,
              })
            )
          } catch (err) {}
        }
        sendAnswer()
      }
      if (currentQuestion + 1 < loadedQuestions.quiz.length) {
        setIsMultipleChoice(
          loadedQuestions.isMultipleChoice[currentQuestion + 1]
        )
        setCurrentQuestion(currentQuestion + 1)
      } else setLastQuestion(true)

      setClickedAnswers([])
    }
  }

  const functionDate = (date) => {
    date.setHours(date.getHours() - 3)
    return moment(date.getTime())
  }

  const calculatePercentage = (value) => {
    return Math.round((currentQuestion / value) * 100)
  }

  const onChange = (checkedValues) => {
    if (isMultipleChoice) setClickedAnswers(checkedValues)
    else setClickedAnswers(checkedValues.target.value)
  }

  return (
    <>
      {redirect && <Redirect to={{ pathname: history.goBack() }} />}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}

      {!isLoading && loadedQuestions && (
        <>
          {new Date(loadedQuestions.quizExpirationDate).getTime() <
            Date.now() || lastQuestion ? (
            <Redirect to={{ pathname: path, state: { id: id } }} />
          ) : (
            <>
              <div>
                <Cards>
                  <Row>
                    <Col span={6}>{loadedQuestions.title}</Col>

                    <Col style={{ marginLeft: '50%' }}>
                      <Progress
                        type='circle'
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                        percent={calculatePercentage(
                          loadedQuestions.quiz.length
                        )}
                      />
                    </Col>
                    <Col style={{ marginLeft: '5%' }}>
                      <Countdown
                        title='Remaining Time'
                        value={functionDate(new Date(loadedQuestions.endDate))}
                      />
                    </Col>
                  </Row>

                  <div>
                    <label>Question: </label>
                    {loadedQuestions.quiz[currentQuestion].question}
                  </div>
                  <br />
                  {isMultipleChoice && (
                    <Checkbox.Group
                      style={{ width: '100%' }}
                      onChange={onChange}
                    >
                      <Row>
                        {loadedQuestions.quiz[currentQuestion].answers.map(
                          (answer) => (
                            <React.Fragment key={answer._id}>
                              <Col span={24}>
                                <Checkbox value={`${answer.text}`}>
                                  {answer.text}
                                </Checkbox>
                              </Col>
                            </React.Fragment>
                          )
                        )}
                      </Row>
                    </Checkbox.Group>
                  )}
                  {!isMultipleChoice && (
                    <Radio.Group onChange={onChange}>
                      <Space direction='vertical'>
                        {loadedQuestions.quiz[currentQuestion].answers.map(
                          (answer) => (
                            <React.Fragment key={answer._id}>
                              <Radio value={`${answer.text}`}>
                                {answer.text}
                              </Radio>
                            </React.Fragment>
                          )
                        )}
                      </Space>
                    </Radio.Group>
                  )}

                  <Row>
                    <Col span={23}>
                      <Button
                        type='primary'
                        style={{
                          marginLeft: '90%',
                          width: 80,
                          backgroundColor: '#00FF00',
                        }}
                        onClick={() => handleNextButtonClick()}
                      >
                        Next
                      </Button>
                    </Col>
                  </Row>
                </Cards>
              </div>
              <div>
                <Canvas />
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default QuizPage
