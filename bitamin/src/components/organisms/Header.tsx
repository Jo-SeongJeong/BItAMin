import React from 'react'
import Button from '../atoms/Button'

const Header: React.FC = () => {
  return (
    <header className="flex justify-between p-4 bg-gray-800 text-white">
      <h1>My App</h1>
      <Button label="Sign In" onClick={() => alert('Sign In clicked')} />
    </header>
  )
}

export default Header
