import React from 'react'
import ReactDOM from 'react-dom/client'
import 'index.css'
import App from 'App.tsx'
import './fonts/Font.css'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<App />)
root.render(
  // <React.StrictMode>
  //   <App />
  <App />
)
