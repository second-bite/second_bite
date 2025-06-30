import { useState, createContext } from 'react'
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import './App.css'


import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'
import FeedbackModal from './components/feedback/FeedbackModal'
import AccountInfoPage from './pages/AccountInfoPage'

export const AppContext = createContext()

function App() {
  const [is_feedback_modal, setIsFeedbackModal] = useState(false)

  return (
    <AppContext.Provider value={{is_feedback_modal, setIsFeedbackModal}}>
      <div className="App">
        <Router>
          <Routes>
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/main' element={<MainPage />} />
            <Route path='/account' element={<AccountInfoPage />} />
          </Routes>
        </Router>
        <FeedbackModal />
      </div>
    </AppContext.Provider>
  )
}


export default App
