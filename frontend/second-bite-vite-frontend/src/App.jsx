import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
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
import { AuthProvider } from './context/AuthContext'
import OwnerProtected from './protected_routing/OwnerProtected'
import ConsumerProtected from './protected_routing/ConsumerProtected'
import RestaurantModal from './components/modals/RestaurantModal'
import RatingModal from './components/modals/RatingModal'

function App() {

  return (
    <AppProvider>
      <AuthProvider>
        <div className="App">
          <Router>
            <Routes>
              <Route path='/auth' element={<AuthPage />} />

              {/* Consumer Routes */}
              <Route element={<ConsumerProtected />}>
                <Route path='/main' element={<MainPage />} />
                <Route path='/account' element={<AccountInfoPage />} />
              </Route>

              {/* Owner Routes */}
              <Route element={<OwnerProtected />}>
                <Route path='/analytics' element={<AnalyticsPage />} />
                <Route path='/owner' element={<OwnerInfoPage />} />
              </Route>
            </Routes>
          </Router>
          <FeedbackModal />
          <AddRestaurantModal />
          <RestaurantModal />
          <RatingModal />
        </div>
      </AuthProvider>
    </AppProvider>
  )
}


export default App
