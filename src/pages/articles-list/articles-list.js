import { Pagination } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ArticleHeader from '../../components/article-header'
import Loader from '../../components/loader/loader'
import { fetchArticles, pageChange } from '../../store/articlesReducer'

import './articles-list.scss'

export default function ArticlesListPage() {
  const dispatch = useDispatch()

  const loading = useSelector((state) => state.articles.loading)
  const page = useSelector((state) => state.articles.page)
  const articles = useSelector((state) => state.articles.articles)
  const total = useSelector((state) => state.articles.total)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  const onPageChange = (p) => {
    dispatch(pageChange({ page: p }))
  }

  useEffect(() => {
    dispatch(fetchArticles())
  }, [dispatch, page, isAuthenticated])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <ul className="list">
          {articles.map((article) => (
            <li className="list__card" key={article.slug}>
              <ArticleHeader
                slug={article.slug}
                title={article.title}
                favorited={article.favorited}
                likeCount={article.favoritesCount}
                tags={article.tagList}
                author={article.author}
                description={article.description}
                createdAt={article.createdAt}
              />
            </li>
          ))}
        </ul>
      )}
      <Pagination
        className="pagination"
        defaultCurrent={1}
        pageSize={5}
        current={page}
        total={total}
        showSizeChanger={false}
        onChange={(p) => onPageChange(p)}
      />
    </>
  )
}
