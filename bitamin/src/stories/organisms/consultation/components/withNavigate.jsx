import React from 'react'
import { useNavigate } from 'react-router-dom'

export function withNavigate(Component) {
  return function WrappedComponent(props) {
    const navigate = useNavigate()
    return <Component {...props} navigate={navigate} />
  }
}
