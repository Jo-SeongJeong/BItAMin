import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HealthUpPage from '../pages/HealthUpPage'

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/healthUp" element={<HealthUpPage />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
