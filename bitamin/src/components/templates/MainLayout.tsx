import React from 'react'
import Header from '../organisms/Header'

const MainLayout: React.FC = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  )
}

export default MainLayout
