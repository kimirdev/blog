import { configureStore } from '@reduxjs/toolkit'

import articlesReducer from './articlesReducer'
import authReducer from './authReducer'

export default configureStore({
  reducer: {
    articles: articlesReducer,
    auth: authReducer,
  },
})
