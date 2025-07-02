import { useState, createContext } from 'react'
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import './App.css'


import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'
import FeedbackModal from './components/modals/FeedbackModal'
import AccountInfoPage from './pages/AccountInfoPage'
import AnalyticsPage from './pages/AnalyticsPage'
import OwnerInfoPage from './pages/OwnerInfoPage'
import AddRestaurantModal from './components/modals/AddRestaurantModal'


export const AppContext = createContext()

function App() {
  const [base_url, setBaseURL] = useState(import.meta.env.VITE_BASE_URL)
  const [is_feedback_modal, setIsFeedbackModal] = useState(false)
  const [is_add_restaurant_modal, setIsAddRestaurantModal] = useState(false)

  return (
    <AppContext.Provider value={{base_url, is_feedback_modal, setIsFeedbackModal, is_add_restaurant_modal, setIsAddRestaurantModal}}>
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
    </AppContext.Provider>
  )
}


export default App
