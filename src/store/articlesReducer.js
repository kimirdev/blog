import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import blog from '../services/blog'

export const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
}

const initialState = {
  loading: false,
  articles: [],
  currentArticle: null,
  page: 1,
  total: 0,
  error: null,
  status: STATUS.PENDING,
}

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (_, { rejectWithValue, getState }) => {
  try {
    const { articles, auth } = getState()
    const offset = (articles.page - 1) * 5
    return await blog.fetchArticles(`?limit=5&offset=${offset}`, 'GET', auth.token)
  } catch (err) {
    return rejectWithValue(err)
  }
})

export const fetchArticle = createAsyncThunk('articles/fetchArticle', async (slug, { rejectWithValue, getState }) => {
  try {
    return await blog.fetchArticles(`/${slug}`, 'GET', getState().auth.token)
  } catch (err) {
    return rejectWithValue(err)
  }
})

export const fetchFavoriteArticle = createAsyncThunk(
  'articles/fetchFavorite',
  async (slug, { rejectWithValue, getState }) => {
    try {
      return await blog.fetchArticles(`/${slug}/favorite`, 'POST', getState().auth.token)
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchUnfavoriteArticle = createAsyncThunk(
  'articles/fetchUnfavorite',
  async (slug, { rejectWithValue, getState }) => {
    try {
      return await blog.fetchArticles(`/${slug}/favorite`, 'DELETE', getState().auth.token)
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchCreateArticle = createAsyncThunk(
  'articles/fetchCreateArticle',
  async (data, { rejectWithValue, getState }) => {
    const bodyJson = JSON.stringify({
      article: data,
    })

    try {
      return await blog.fetchArticles('', 'POST', getState().auth.token, bodyJson)
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchDeleteArticle = createAsyncThunk(
  'articles/fetchDeleteArticle',
  async (slug, { rejectWithValue, getState }) => {
    try {
      return blog.fetchArticles(`/${slug}`, 'DELETE', getState().auth.token).ok
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchUpdateArticle = createAsyncThunk(
  'articles/fetchUpdateArticle',
  async ({ article, slug }, { rejectWithValue, getState }) => {
    const { token } = getState().auth

    const bodyJson = JSON.stringify({
      article,
    })

    try {
      return await blog.fetchArticles(`/${slug}`, 'PUT', token, bodyJson)
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

const articleFulfilledPayload = (state, action) => {
  state.currentArticle = action.payload?.article
  state.loading = false
  state.status = STATUS.FULFILLED
}

const articlePendingPayload = (state) => {
  state.loading = true
  state.status = STATUS.PENDING
}

const articleRejectedPayload = (state) => {
  state.loading = false
  state.status = STATUS.REJECTED
}

const favArticleFulfilledPayload = (state, action) => {
  if (state.currentArticle) {
    state.currentArticle = action.payload.article
  } else {
    const idx = state.articles.findIndex((a) => a.slug === action.payload.article.slug)
    state.articles[idx] = action.payload.article
  }
}

const articles = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    pageChange(state, action) {
      state.page = action.payload.page
      state.loading = true
    },
    statusPending(state) {
      state.status = STATUS.PENDING
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false
        state.articles = action.payload.articles
        state.currentArticle = null
        state.total = action.payload.articlesCount
      })
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true
        state.currentArticle = null
      })
      .addCase(fetchArticles.rejected, (state) => {
        state.currentArticle = null
      })

    builder
      .addCase(fetchFavoriteArticle.fulfilled, favArticleFulfilledPayload)
      .addCase(fetchFavoriteArticle.rejected, (state, action) => {
        state.error = action.payload.error
      })

    builder
      .addCase(fetchUnfavoriteArticle.fulfilled, favArticleFulfilledPayload)
      .addCase(fetchUnfavoriteArticle.rejected, (state, action) => {
        state.error = action.payload.error
      })

    builder
      .addCase(fetchArticle.fulfilled, articleFulfilledPayload)
      .addCase(fetchArticle.pending, articlePendingPayload)
      .addCase(fetchArticle.rejected, articleRejectedPayload)

    builder
      .addCase(fetchCreateArticle.fulfilled, articleFulfilledPayload)
      .addCase(fetchCreateArticle.pending, articlePendingPayload)
      .addCase(fetchCreateArticle.rejected, articleRejectedPayload)

    builder
      .addCase(fetchDeleteArticle.fulfilled, articleFulfilledPayload)
      .addCase(fetchDeleteArticle.pending, articlePendingPayload)
      .addCase(fetchDeleteArticle.rejected, articleRejectedPayload)

    builder
      .addCase(fetchUpdateArticle.fulfilled, articleFulfilledPayload)
      .addCase(fetchUpdateArticle.pending, articlePendingPayload)
      .addCase(fetchUpdateArticle.rejected, articleRejectedPayload)
  },
})

export const { pageChange, statusPending } = articles.actions

export default articles.reducer
