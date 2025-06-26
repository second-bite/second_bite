import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import './App.css'

import AuthHeader from './header/AuthHeader'
import AuthPage from './pages/AuthPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <AuthHeader />
      <Router>
        <AuthPage />
      </Router>
    </div>
  )
}

export default App
