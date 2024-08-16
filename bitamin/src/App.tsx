import React from 'react'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import AppRouter from 'router/AppRouter'
import Footer from 'stories/organisms/common/Footer'
import Header from './stories/organisms/common/Header'

const AppContent: React.FC = () => {
  const location = useLocation()
  const excludeHeaderPaths = ['/', '/consult']
  const excludeFooterPaths = [
    '/',
    '/modal',
    '/consult',
    '/healthup',
    '/mypage',
    '/loginex',
    '/signup',
  ]
  const includeContentPaths = ['/'] // 특정 경로들을 여기에 추가하세요.

  const contentClassName = includeContentPaths.includes(location.pathname)
    ? 'flex-grow mt-[6%]'
    : 'flex-grow' // 기본적으로는 'flex-grow'만 적용

  return (
    <div className="flex flex-col min-h-screen">
      {!excludeHeaderPaths.includes(location.pathname) && <Header />}
      <div className="contentClassName">
        <AppRouter />
      </div>
      {!excludeFooterPaths.includes(location.pathname) && <Footer />}
    </div>
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
