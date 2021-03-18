import React, { useContext, useEffect, useState } from 'react'
import '../../App.css'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators'
import Cards from '../../shared/components/UI/Cards'
import Button from '../../shared/components/FormElements/Button'
import { useForm } from '../../shared/hooks/form-hook'
import Input from '../../shared/components/FormElements/Input'

export default function QuizCreate() {
  const { isLoading, sendRequest } = useHttpClient()
  const auth = useContext(AuthContext)
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      startDate: {
        value: '',
        isValid: false,
      },
      endDate: {
        value: '',
        isValid: false,
      },
    },
    false
  )
  const placeSubmitHandler = null

  return (
    <>
      <form className='place-form' onSubmit={placeSubmitHandler}></form>
      {isLoading && <LoadingSpinner asOverlay />}
      <Input
        id='title'
        element='input'
        type='text'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid title.'
        onInput={inputHandler}
      />

      <Input
        id='startDate'
        element='input'
        type='text'
        label='startDate'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid startDate.'
        onInput={inputHandler}
      />
      <Input
        id='endDate'
        element='input'
        type='text'
        label='endDate'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid endDate.'
        onInput={inputHandler}
      />
      <Button type='submit' disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </>
  )
}
