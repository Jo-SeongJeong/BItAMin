import React from 'react'
import './Button.module.css'

interface ButtonProps {
  label: string
  type: string
  onClick: () => void
}

const Button: React.FC<ButtonProps> = ({ label, type, onClick }) => {
  return (
    <button className={`Button Button_${type}`} onClick={onClick}>
      {label}
    </button>
  )
}

export default Button
