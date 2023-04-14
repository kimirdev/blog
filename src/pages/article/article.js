import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import ArticleHeader from '../../components/article-header'
import { fetchArticle, STATUS, statusPending } from '../../store/articlesReducer'
import './article.scss'
import Loader from '../../components/loader/loader'

export default function Article() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const loading = useSelector((state) => state.articles.loading)
  const article = useSelector((state) => state.articles.currentArticle)
  const status = useSelector((state) => state.articles.status)

  useEffect(() => {
    dispatch(fetchArticle(slug))
  }, [dispatch, slug, isAuthenticated])

  useEffect(() => {
    if (!loading && !article && status !== STATUS.PENDING) {
      navigate('/articles')
    }
  }, [article, navigate, loading, status, dispatch])

  useEffect(() => () => dispatch(statusPending()))

  return (
    <div className="article">
      {loading || !article ? (
        <Loader />
      ) : (
        <>
          <ArticleHeader
            className="header"
            slug={article.slug}
            title={article.title}
            favorited={article.favorited}
            likeCount={article.favoritesCount}
            tags={article.tagList}
            author={article.author}
            description={article.description}
            createdAt={article.createdAt}
          />
          <div className="article-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
          </div>
        </>
      )}
    </div>
  )
}
