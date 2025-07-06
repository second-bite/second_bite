import React, {useState, createContext} from "react"

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [base_url, setBaseURL] = useState(import.meta.env.VITE_BASE_URL)
    const [is_feedback_modal, setIsFeedbackModal] = useState(false)
    const [is_add_restaurant_modal, setIsAddRestaurantModal] = useState(false)
    const [restaurants, setRestaurants] = useState([])

    return (
        <AppContext.Provider value={{base_url, is_feedback_modal, setIsFeedbackModal, is_add_restaurant_modal, setIsAddRestaurantModal, restaurants, setRestaurants}}>
            {children}
        </AppContext.Provider>
    )
}