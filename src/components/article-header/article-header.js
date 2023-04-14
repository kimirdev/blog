import React, { useState } from 'react'
import { format } from 'date-fns'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Popconfirm } from 'antd'

import './article-header.scss'

import heart from '../../assets/heart.svg'
import heartFilled from '../../assets/heartFilled.svg'
import { fetchDeleteArticle, fetchFavoriteArticle, fetchUnfavoriteArticle } from '../../store/articlesReducer'

export default function ArticleHeader({ slug, title, favorited, likeCount, tags, author, description, createdAt }) {
  const params = useParams()
  const dispatch = useDispatch()

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user)

  const [fav, setFav] = useState(favorited)

  const handleLikeClick = () => {
    if (!isAuthenticated) return

    if (fav) {
      dispatch(fetchUnfavoriteArticle(slug))
    } else {
      dispatch(fetchFavoriteArticle(slug))
    }
    setFav((f) => !f)
  }

  return (
    <div className="article-header">
      <div className="article-header__info">
        <div>
          <div className="article-header__title-like">
            <Link to={`/articles/${slug}`} style={{ textDecoration: 'none' }}>
              <h3 className="article-header__title">{title.length > 60 ? `${title.slice(0, 60)}...` : title}</h3>
            </Link>
            <button className="article-header__like-btn" type="button" onClick={handleLikeClick}>
              <img src={fav ? heartFilled : heart} alt="like" />
              <span className="article-header__like-count">
                {/* eslint-disable-next-line no-nested-ternary */}
                {fav === favorited ? likeCount : fav ? likeCount + 1 : likeCount - 1}
              </span>
            </button>
          </div>
          <div className="article-header__tags">
            {tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag.length > 12 ? `${tag.slice(0, 12)}...` : tag}
              </span>
            ))}
          </div>
        </div>
        <div className="article-header__author-info">
          <div className="text-info">
            <div className="article-header__author-name">{author.username}</div>
            <span className="article-header__date">{format(new Date(createdAt), 'MMMM d, yyyy')}</span>
          </div>
          <img src={author.image} alt="author" width={46} height={46} className="avatar" />
        </div>
      </div>
      <div className="article-header__body">
        <div className="article-header__description">
          {description.length > 205 ? `${description.slice(0, 205)}...` : description}
        </div>
        {params.slug && user?.username === author.username && (
          <div className="article-header__controls">
            <Popconfirm
              placement="right"
              title="Delete the article"
              description="Are you sure to delete this article?"
              onConfirm={() => dispatch(fetchDeleteArticle(slug))}
              okText="Yes"
              cancelText="No"
            >
              <button type="button" className="delete-btn">
                Delete
              </button>
            </Popconfirm>
            <Link to={`/articles/${slug}/edit`} className="edit-btn">
              Edit
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
