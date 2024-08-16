import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'

interface PrivateRouteProps {
  authentication: boolean
  requiredRole?: string
  children?: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  authentication,
  requiredRole,
  children,
}) => {
  const { accessToken, role } = useAuthStore()

  // 사용자 인증을 위해 토큰 확인
  if (authentication) {
    if (!accessToken) {
      return <Navigate to="/login" />
    }
    if (requiredRole && role !== requiredRole) {
      return <Navigate to="/home" />
    }
    return children ? <>{children}</> : <Outlet />
  } else {
    return !accessToken ? (
      children ? (
        <>{children}</>
      ) : (
        <Outlet />
      )
    ) : (
      <Navigate to="/home" />
    )
  }
}

export default PrivateRoute
