import React, {useState, createContext} from "react"

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [base_url, setBaseURL] = useState(import.meta.env.VITE_BASE_URL)
    const [recommendation_url, setRecommendationURL] = useState(import.meta.env.VITE_RECOMMENDATIONURL)
    const [is_feedback_modal, setIsFeedbackModal] = useState(false)
    const [is_add_restaurant_modal, setIsAddRestaurantModal] = useState(false)
    const [is_restaurant_modal, setIsRestaurantModal] = useState(false)
    const [is_rating_modal, setIsRatingModal] = useState(false)
    const [is_friend_modal, setIsFriendModal] = useState(false)
    const [selected_restaurant, setSelectedRestaurant] = useState({})
    const [restaurants, setRestaurants] = useState([])
    const [displayed_restaurants, setDisplayedRestaurants] = useState([])
    const [searched_address, setSearchedAddress] = useState({})
    const [is_recommended_visible, setIsRecommendedVisible] = useState(true)  

    return (
        <AppContext.Provider value={{base_url, recommendation_url, is_feedback_modal, setIsFeedbackModal, is_add_restaurant_modal, setIsAddRestaurantModal, is_restaurant_modal, setIsRestaurantModal, is_rating_modal, setIsRatingModal, is_friend_modal, setIsFriendModal, selected_restaurant, setSelectedRestaurant, restaurants, setRestaurants, displayed_restaurants, setDisplayedRestaurants, searched_address, setSearchedAddress, is_recommended_visible, setIsRecommendedVisible}}>
            {children}
        </AppContext.Provider>
    )
}