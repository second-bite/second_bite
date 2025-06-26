import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import './App.css'


import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/main' element={<MainPage />} />
        </Routes>
      </Router>
    </div>
  )
}


export default App
