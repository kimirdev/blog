import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function useAutheticatedRedirect(isAuth, path) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated === isAuth) {
      navigate(path)
    }
  }, [isAuthenticated, navigate, isAuth, path])
}
