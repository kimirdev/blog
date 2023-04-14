import React from 'react'

import './form-group.scss'

export default function FormGroup({ group, register, errors, last }) {
  const input =
    group.type === 'textArea' ? (
      <textarea
        name={group.name}
        id={group.name}
        placeholder={group.title}
        {...register(group.name, group.errors)}
        aria-invalid={errors[group.name] ? 'true' : 'false'}
      />
    ) : (
      <input
        type={group.type}
        name={group.name}
        id={group.name}
        placeholder={group.title}
        {...register(group.name, group.errors)}
        aria-invalid={errors[group.name] ? 'true' : 'false'}
      />
    )
  return (
    <div className={`form-group${last ? ' last' : ''}`} key={group.name}>
      <label htmlFor={group.name}>
        <span className="input-label">{group.title}</span>
        {input}
      </label>
      {errors[group.name] && <span className="error">{errors[group.name].message}</span>}
    </div>
  )
}
