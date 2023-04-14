import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import useAutheticatedRedirect from '../../hooks/useAuthenticatedRedirect'
import useCallbackOnServerError from '../../hooks/useCallbackOnServerError'
import { fetchUserRegister, removeError } from '../../store/authReducer'
import UserForm from '../../components/user-form'
import FormGroup, {
  customTemplate,
  emailTemplate,
  passwordTemplate,
  usernameTemplate,
} from '../../components/form-group'

import './sign-up.scss'

export default function SignUp() {
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm()

  const onSubmit = (data) => {
    const user = {
      username: data.username,
      password: data.password,
      email: data.email,
    }
    dispatch(fetchUserRegister(user))
  }

  useAutheticatedRedirect(true, '/')

  useCallbackOnServerError(setError)

  useEffect(() => () => dispatch(removeError()), [dispatch])

  const groups = [
    usernameTemplate,
    emailTemplate,
    passwordTemplate,
    customTemplate('Repeat Password', 'password', 'repeatPassword', {
      validate: (value) => value === watch('password') || 'Passwords do not match',
    }),
  ]

  return (
    <UserForm
      onSubmit={handleSubmit(onSubmit)}
      className="sign-up-form"
      title="Create new account"
      submitText="Create"
      span={
        <span className="already-have">
          Already have an account? <Link to="/sign-in">Sign In</Link>.
        </span>
      }
    >
      {groups.map((g, idx) => (
        <FormGroup group={g} register={register} errors={errors} last={idx === groups.length - 1} key={g.name} />
      ))}

      <div className="agreeToTerms">
        <label htmlFor="agreeToTerms">
          <input
            type="checkbox"
            name="agreeToTerms"
            id="agreeToTerms"
            {...register('agreeToTerms', { required: true })}
            aria-invalid={errors.agreeToTerms ? 'true' : 'false'}
          />
          <span className="agree-label">I agree to the processing of my personal information</span>
        </label>
        {errors.agreeToTerms && <span className="error">You must agree to the terms and conditions</span>}
      </div>
    </UserForm>
  )
}
