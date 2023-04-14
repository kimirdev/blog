import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { logOut } from '../../store/authReducer'
import Loader from '../loader/loader'

import './header.scss'

export default function Header() {
  const dispatch = useDispatch()

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)

  const headerPanel = !isAuthenticated ? (
    <>
      <Link to="/sign-in" className="header__sign-in header__btn">
        Sign in
      </Link>
      <Link to="/sign-up" className="header__sign-up header__btn">
        Sign up
      </Link>
    </>
  ) : (
    <>
      <Link to="/new-article" className="header__create-article">
        Create article
      </Link>
      <Link to="/profile" className="header__username">
        {user?.username}
      </Link>

      <Link to="/profile">
        <img
          src={user?.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'}
          alt="avatar"
          className="header__avatar"
        />
      </Link>
      <button className="header__logout header__btn" type="button" onClick={() => dispatch(logOut())}>
        Log Out
      </button>
    </>
  )

  return (
    <header className="header">
      <Link to="/" className="header__title">
        Realword Blog
      </Link>
      <div className="header__panel">{loading ? <Loader /> : headerPanel}</div>
    </header>
  )
}
