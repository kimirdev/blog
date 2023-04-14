import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import blog from '../services/blog'

const initialState = {
  token: '',
  isAuthenticated: false,
  user: null,
  error: null,
  loading: false,
}

export const fetchUserRegister = createAsyncThunk('user/fetchUserRegister', async (user, { rejectWithValue }) => {
  try {
    const dataJson = JSON.stringify({
      user,
    })
    const res = await blog.fetchBlog('/users', 'POST', '', dataJson)
    if (!res.ok) {
      return rejectWithValue(await res.json())
    }

    return await res.json()
  } catch (err) {
    return rejectWithValue(err)
  }
})

export const fetchUserLogin = createAsyncThunk('user/fetchUserLogin', async (user, { rejectWithValue }) => {
  try {
    const dataJson = JSON.stringify({
      user,
    })
    const res = await blog.fetchBlog('/users/login', 'POST', '', dataJson)

    if (!res.ok) return rejectWithValue(await res.json())

    return await res.json()
  } catch (err) {
    return rejectWithValue(err)
  }
})

export const fetchUser = createAsyncThunk('user/fetchUser', async (token, { rejectWithValue, getState }) => {
  try {
    const res = await blog.fetchBlog('/user', 'GET', token || getState().auth.token)
    if (!res.ok) return rejectWithValue(await res.json())
    return await res.json()
  } catch (err) {
    return rejectWithValue(err)
  }
})

export const fetchUserEdit = createAsyncThunk('user/fetchUserEdit', async (user, { rejectWithValue, getState }) => {
  const dataJson = JSON.stringify({
    user,
  })

  try {
    const res = await blog.fetchBlog('/user', 'PUT', getState().auth.token, dataJson)
    if (!res.ok) return rejectWithValue(await res.json())

    return await res.json()
  } catch (err) {
    return rejectWithValue(err)
  }
})

const userFulfilledPayload = (state, action) => {
  localStorage.setItem('token', action.payload.user.token)
  state.token = action.payload.user.token
  state.user = action.payload.user
  state.isAuthenticated = true
  state.loading = false
  state.error = null
}

const userPendingPayload = (state) => {
  state.loading = true
}

const userRejectedPayload = (state, action) => {
  if (action.payload) {
    state.error = action.payload.errors
  } else {
    state.error = action.error
  }
  state.loading = false
}

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut(state) {
      localStorage.removeItem('token')
      state.token = ''
      state.isAuthenticated = false
      state.user = null
    },
    removeError(state) {
      state.error = null
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserRegister.fulfilled, userFulfilledPayload)
      .addCase(fetchUserRegister.pending, userPendingPayload)
      .addCase(fetchUserRegister.rejected, userRejectedPayload)

    builder
      .addCase(fetchUserLogin.fulfilled, userFulfilledPayload)
      .addCase(fetchUserLogin.pending, userPendingPayload)
      .addCase(fetchUserLogin.rejected, userRejectedPayload)

    builder
      .addCase(fetchUserEdit.fulfilled, userFulfilledPayload)
      .addCase(fetchUserEdit.pending, userPendingPayload)
      .addCase(fetchUserEdit.rejected, userRejectedPayload)

    builder
      .addCase(fetchUser.fulfilled, userFulfilledPayload)
      .addCase(fetchUser.pending, userPendingPayload)
      .addCase(fetchUser.rejected, () => {
        localStorage.removeItem('token')
        return initialState
      })
  },
})

export const { logOut, removeError } = auth.actions

export default auth.reducer
