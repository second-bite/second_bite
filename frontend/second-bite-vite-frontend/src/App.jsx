import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import "@radix-ui/themes/styles.css";

// Tailwind Themes
import { Theme } from "@radix-ui/themes";

// Contexts
import { AppProvider } from './context/AppContext'

// Pages
import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'
import OwnerInfoPage from './pages/OwnerInfoPage'
import ChatPage from './pages/ChatPage'
import AccountInfoPage from './pages/AccountInfoPage'
import AnalyticsPage from './pages/AnalyticsPage'
import { AuthProvider } from './context/AuthContext'
import OwnerProtected from './protected_routing/OwnerProtected'
import ConsumerProtected from './protected_routing/ConsumerProtected'
import FeedbackModal from './components/modals/FeedbackModal'
import AddRestaurantModal from './components/modals/AddRestaurantModal'
import RestaurantModal from './components/modals/RestaurantModal'
import RatingModal from './components/modals/RatingModal'
import FriendModal from './components/modals/FriendModal'

function App() {

  return (
    <Theme>
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
                  <Route path='/chat' element={<ChatPage />} />
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
            <FriendModal />
          </div>
        </AuthProvider>
      </AppProvider>
    </Theme>
  )
}


export default App
