import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import FormGroup, { emailTemplate, passwordTemplate } from '../../components/form-group'
import UserForm from '../../components/user-form'
import useAutheticatedRedirect from '../../hooks/useAuthenticatedRedirect'
import { fetchUserLogin, removeError } from '../../store/authReducer'

import './sign-in.scss'

export default function SignIn() {
  const dispatch = useDispatch()

  const serverErrors = useSelector((state) => state.auth.error)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm()

  const onSubmit = (data) => {
    const user = {
      email: data.email,
      password: data.password,
    }

    dispatch(fetchUserLogin(user))
  }

  useAutheticatedRedirect(true, '/')

  useEffect(() => {
    if (serverErrors && serverErrors['email or password']) {
      setError('email', { type: 'server', message: 'Email or password is not correct' })
      setError('password', { type: 'server', message: 'Email or password is not correct' })
    }
  }, [serverErrors, setError])

  useEffect(() => () => dispatch(removeError()), [dispatch])

  const groups = [emailTemplate, passwordTemplate]

  return (
    <UserForm
      onSubmit={handleSubmit(onSubmit)}
      className="sign-in-form"
      title="Sign In"
      submitText="Login"
      span={
        <span className="already-have">
          Don’t have an account? <Link to="/sign-up">Sign Up</Link>.
        </span>
      }
    >
      {groups.map((g, idx) => (
        <FormGroup group={g} register={register} errors={errors} last={idx === groups.length - 1} key={g.name} />
      ))}
    </UserForm>
  )
}
