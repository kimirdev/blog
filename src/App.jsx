import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Routes, Route } from 'react-router-dom'

import Layout from './components/layout'
import Article from './pages/article'
import ArticleForm from './pages/article-form'
import ArticlesListPage from './pages/articles-list'
import EditProfile from './pages/edit-profile'
import SignIn from './pages/sign-in'
import SignUp from './pages/sing-up'
import { fetchUser } from './store/authReducer'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(fetchUser(token))
    }
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ArticlesListPage />} />
        <Route path="articles" element={<ArticlesListPage />} />
        <Route path="articles/:slug" element={<Article />} />
        <Route path="articles/:slug/edit" element={<ArticleForm />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="profile" element={<EditProfile />} />
        <Route path="new-article" element={<ArticleForm />} />
      </Route>
    </Routes>
  )
}

export default App
