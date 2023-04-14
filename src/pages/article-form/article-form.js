import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import FormGroup, { customTemplate } from '../../components/form-group'
import Loader from '../../components/loader/loader'
import useAutheticatedRedirect from '../../hooks/useAuthenticatedRedirect'
import { fetchCreateArticle, fetchUpdateArticle, STATUS } from '../../store/articlesReducer'

import './article-form.scss'

export default function ArticleForm() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loading = useSelector((state) => state.articles.loading)
  const currentArticle = useSelector((state) => state.articles.currentArticle)
  const status = useSelector((state) => state.articles.status)

  useAutheticatedRedirect(false, '/sign-in')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      tags: [{ value: '' }],
    },
  })

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'tags',
  })

  useEffect(() => {
    if (currentArticle && status !== STATUS.PENDING) {
      navigate(`/articles/${currentArticle.slug}`)
    }
  }, [currentArticle, navigate, status, loading])

  useEffect(() => {
    if (slug && currentArticle) {
      setValue('title', currentArticle.title)
      setValue('description', currentArticle.description)
      setValue('textArea', currentArticle.body)
      replace(currentArticle.tagList.map((x) => ({ value: x })))
    } else {
      setValue('title', '')
      setValue('description', '')
      setValue('textArea', '')
      replace([{ value: '' }])
    }
  }, [slug, currentArticle, setValue, replace])

  const onSubmit = (data) => {
    const article = {
      title: data.title,
      description: data.description,
      body: data.textArea,
      tagList: [...data.tags.reduce((prev, curr) => prev.add(curr.value), new Set([]))],
    }

    if (slug) {
      const body = {
        article,
        slug,
      }
      dispatch(fetchUpdateArticle(body))
    } else {
      dispatch(fetchCreateArticle(article))
    }
  }

  const groups = [
    customTemplate('Title', 'text', 'title', { required: 'Title is required' }),
    customTemplate('Short description', 'text', 'description', { required: 'Description is required' }),
    customTemplate('Text', 'textArea', 'textArea', { required: 'Text is required' }),
  ]

  const formTitle = !slug ? 'Create new article' : 'Edit article'

  return (
    <form className="article-form" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="form-title">{formTitle}</h3>

      {groups.map((g) => (
        <FormGroup group={g} register={register} errors={errors} key={g.name} />
      ))}

      <div className="form-group tags">
        <span className="input-label">Tags</span>
        {fields.map((item, index) => (
          <label className="tag-label" htmlFor={`tags.${index}`} key={item.id}>
            <div>
              <input
                className="tag"
                type="tag"
                name="tag"
                id={`tags.${index}`}
                placeholder="Tag"
                {...register(`tags.${index}.value`, { required: 'Type tag or delete it' })}
                aria-invalid={errors.tags && errors.tags[index] ? 'true' : 'false'}
              />
              {errors.tags && <span className="error">{errors.tags[index]?.value.message}</span>}
            </div>
            <button className="delete-tag-btn tag-btn" type="button" onClick={() => remove(index)}>
              Delete
            </button>
            {index === fields.length - 1 && (
              <button className="add-tag-btn tag-btn" type="button" onClick={() => append({ value: '' })}>
                Add tag
              </button>
            )}
          </label>
        ))}
        {fields.length === 0 && (
          <button className="add-tag-btn tag-btn" type="button" onClick={() => append({ value: '' })}>
            Add tag
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <button type="submit" className="submit-button">
          Send
        </button>
      )}
    </form>
  )
}
