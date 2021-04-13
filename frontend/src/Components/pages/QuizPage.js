import React, { useContext, useState, useEffect } from 'react'
import { Redirect, useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import Cards from '../../shared/components/UI/Cards'
import Countdown from 'react-countdown'

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
  let history = useHistory()

  const path = `/quiz/${id}/result`

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/quiz/course/' + id
        )
        setLoadedQuestions(responseData.data)
      } catch (err) {
        setRedirect(true)
      }
    }
    fetchQuiz()
  }, [sendRequest, auth.token, id])

  const handleAnswerButtonClick = (text) => {
    setClickedAnswers([...clickedAnswers, text])

    if (clickedAnswers.includes(text)) {
      let newArr = clickedAnswers
      newArr.splice(clickedAnswers.indexOf(text), 1)
      setClickedAnswers([])
      setClickedAnswers(newArr)
    }
  }

  const handleNextButtonClick = () => {
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
    if (currentQuestion + 1 < loadedQuestions.quiz.length)
      setCurrentQuestion(currentQuestion + 1)
    else setLastQuestion(true)

    setClickedAnswers([])
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
          {new Date(loadedQuestions.endDate).getTime() < Date.now() ||
          lastQuestion ? (
            // <Redirect
            //   to={{ pathname: path, state: { id: id, answers: answers } }}
            // />
            <div>
              </div>
          ) : (
            <Cards>
              <div>{loadedQuestions.title}</div>
              <div>
                Remaining Time
                <Countdown
                  date={
                    new Date(loadedQuestions.startDate).getTime() +
                    (new Date(loadedQuestions.endDate).getTime() -
                      new Date(loadedQuestions.startDate).getTime())
                  }
                />
              </div>
              <div>{loadedQuestions.quiz[currentQuestion].question}</div>
              <div>
                {loadedQuestions.quiz[currentQuestion].answers.map((answer) => (
                  <React.Fragment key={answer._id}>
                    <Button
                      style={{ marginBottom: 10 }}
                      onClick={() =>
                        handleAnswerButtonClick(answer.text)
                      }
                    >
                      {answer.text}
                    </Button>
                    <br />
                  </React.Fragment>
                ))}

                <Button
                  type='primary'
                  style={{
                    marginLeft: '95%',
                    width: 80,
                    backgroundColor: '#00FF00',
                  }}
                  onClick={() => handleNextButtonClick()}
                >
                  Next
                </Button>
              </div>
            </Cards>
          )}
        </>
      )}
    </>
  )
}

export default QuizPage
