import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function useCallbackOnServerError(callback) {
  const serverError = useSelector((state) => state.auth.error)

  useEffect(() => {
    if (serverError) {
      Object.keys(serverError).forEach((key) => {
        callback(key, { type: 'server', message: serverError[key] })
      })
    }
  }, [serverError, callback])
}
