import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 1. นำเข้า BrowserRouter
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. เอา BrowserRouter ครอบ App */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
