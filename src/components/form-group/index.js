import FormGroup from './form-group'

export default FormGroup

export const usernameTemplate = {
  title: 'Username',
  type: 'text',
  name: 'username',
  errors: {
    required: { value: true, message: 'Username is required' },
    minLength: { value: 3, message: 'Username must be from 3 to 20 characters' },
    maxLength: { value: 20, message: 'Username must be from 3 to 20 characters' },
  },
}

export const emailTemplate = {
  title: 'Email address',
  type: 'email',
  name: 'email',
  errors: {
    required: { value: true, message: 'Email is required' },
    pattern: { value: /^\S+@\S+\.\S+$/i, message: 'Invalid email address' },
  },
}

export const passwordTemplate = {
  title: 'Password',
  type: 'password',
  name: 'password',
  errors: {
    required: { value: true, message: 'Password is required' },
    minLength: { value: 6, message: 'Password must be from 6 to 40 characters' },
    maxLength: { value: 40, message: 'Password must be from 6 to 40 characters' },
  },
}

export const passwordNotRequiredTemplate = {
  title: 'Password',
  type: 'password',
  name: 'password',
  errors: {
    minLength: { value: 6, message: 'Password must be from 6 to 40 characters' },
    maxLength: { value: 40, message: 'Password must be from 6 to 40 characters' },
  },
}

export const customTemplate = (title, type, name, errors) => ({
  title,
  type,
  name,
  errors,
})
