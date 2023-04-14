import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import useAutheticatedRedirect from '../../hooks/useAuthenticatedRedirect'
import { fetchUserEdit } from '../../store/authReducer'
import useCallbackOnServerError from '../../hooks/useCallbackOnServerError'
import UserForm from '../../components/user-form'
import FormGroup, {
  customTemplate,
  emailTemplate,
  passwordNotRequiredTemplate,
  usernameTemplate,
} from '../../components/form-group'

import './edit-profile.scss'

const imageChecker = async (value) => {
  try {
    if (value.length > 0) {
      await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = value
      })
    }
    return true
  } catch {
    return 'Image not found'
  }
}

export default function EditProfile() {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth.user)

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.username,
      email: user?.email,
      avatar: user?.image,
    },
  })

  useAutheticatedRedirect(false, '/sign-in')

  useCallbackOnServerError(setError)

  const onSubmit = (data) => {
    const toSend = {}
    if (data.username?.length > 0) {
      toSend.username = data.username
    }
    if (data.email?.length > 0) {
      toSend.email = data.email
    }
    if (data.password?.length > 0) {
      toSend.password = data.password
    }
    toSend.image = data.avatar || ''
    dispatch(fetchUserEdit(toSend))
  }

  const groups = [
    usernameTemplate,
    emailTemplate,
    passwordNotRequiredTemplate,
    customTemplate('Avatar image (url)', 'text', 'avatar', {
      pattern: {
        value: /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi,
        message: 'Link is invalid',
      },
      validate: imageChecker,
    }),
  ]

  return (
    <UserForm onSubmit={handleSubmit(onSubmit)} className="edit-profile-form" title="Edit Profile" submitText="Save">
      {groups.map((g, idx) => (
        <FormGroup group={g} register={register} errors={errors} last={idx === groups.length - 1} key={g.name} />
      ))}
    </UserForm>
  )
}
