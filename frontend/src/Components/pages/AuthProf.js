import React, { useState, useContext } from 'react'
import '../../App.css'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UI/Cards'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import Button from '../../shared/components/FormElements/Button'
import './Auth.css'
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'

export default function SignUp() {
  const auth = useContext(AuthContext)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const { isLoading, sendRequest } = useHttpClient()

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  )

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          faculty: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      )
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          faculty: {
            value: '',
            isValid: false
          }
        },
        false
      )
    }
    setIsLoginMode((prevMode) => !prevMode)
  }

  const submitHandler = async (event) => {
    event.preventDefault()

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/auth/login/professor',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json',
          }
        )
        console.log(responseData.role)
        auth.login(responseData.professorId, responseData.token, responseData.role)
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          'http://localhost:5005/api/auth/signup/professor',
          'POST',
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            faculty: formState.inputs.faculty.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        )
        auth.login(responseData.professorId, responseData.token, responseData.role)

        console.log(responseData)
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <>
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={submitHandler}>
          {!isLoginMode && (
            <>
              <Input
                element='input'
                id='name'
                type='text'
                label='Your Name'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a name.'
                onInput={inputHandler}
              />

              <Input
                element='input'
                id='faculty'
                type='faculty'
                label='Faculty'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a faculty.'
                onInput={inputHandler}
              />
            </>
          )}

          <Input
            element='input'
            id='email'
            type='email'
            label='E-Mail'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter a valid email address.'
            onInput={inputHandler}
          />
          <Input
            element='input'
            id='password'
            type='password'
            label='Password'
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText='Please enter a valid password, at least 6 characters.'
            onInput={inputHandler}
          />

          <Button type='submit' disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </>
  )
}
