import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Ex from 'stories/pages/etc/Ex'
import ExLogin from 'stories/pages/account/ExLogin'

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/ex" element={<Ex />} />
        <Route path="/login" element={<ExLogin />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
