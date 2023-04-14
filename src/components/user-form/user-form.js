import React from 'react'
import { useSelector } from 'react-redux'

// import FormGroup from '../form-group'
import Loader from '../loader/loader'

import './user-form.scss'

export default function UserForm({ title, submitText, span, onSubmit, children, className }) {
  const loading = useSelector((state) => state.auth.loading)

  return (
    <form onSubmit={onSubmit} className={`form ${className}`}>
      <h3 className="form-title">{title}</h3>

      {children}

      {loading ? (
        <Loader />
      ) : (
        <button type="submit" className="submit-button">
          {submitText}
        </button>
      )}

      {span}
    </form>
  )
}
