import React, {useState, createContext} from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const auth_status = {
        
    }
    const [is_authenticated, setIsAuthenticated] = useState(false)
    const [is_add_restaurant_modal, setIsAddRestaurantModal] = useState(false)

    return (
        <AuthContext.Provider value={{base_url, is_feedback_modal, setIsFeedbackModal, is_add_restaurant_modal, setIsAddRestaurantModal}}>
            {children}
        </AuthContext.Provider>
    )
}