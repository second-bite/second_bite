import React from 'react'
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import './App.css'

// Contexts
import { AppProvider } from './context/AppContext'

// Pages
import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'
import FeedbackModal from './components/modals/FeedbackModal'
import AccountInfoPage from './pages/AccountInfoPage'
import AnalyticsPage from './pages/AnalyticsPage'
import OwnerInfoPage from './pages/OwnerInfoPage'
import AddRestaurantModal from './components/modals/AddRestaurantModal'

function App() {

  return (
    <AppProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/main' element={<MainPage />} />
            <Route path='/account' element={<AccountInfoPage />} />
            <Route path='/analytics' element={<AnalyticsPage />} />
            <Route path='/owner' element={<OwnerInfoPage />} />
          </Routes>
        </Router>
        <FeedbackModal />
        <AddRestaurantModal />
      </div>
    </AppProvider>
  )
}


export default App
