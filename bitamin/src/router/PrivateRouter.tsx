import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'

const PrivateRoute: React.FC<{ authentication: boolean }> = ({
  authentication,
}) => {
  const { accessToken } = useAuthStore()

  if (authentication) {
    return accessToken ? <Outlet /> : <Navigate to="/login" />
  } else {
    return !accessToken ? <Outlet /> : <Navigate to="/home" />
  }
}

export default PrivateRoute
