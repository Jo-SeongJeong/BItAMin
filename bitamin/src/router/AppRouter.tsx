import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '../components/pages/HomePage.tsx'
import MainPage from '../pages/MainPage.tsx'

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/main" element={<MainPage />} />
    </Routes>
  </Router>
)

export default AppRouter
