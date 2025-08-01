import React, {useState, useRef, useContext, useEffect} from "react"
import { cuisine_filters_react_select } from '../../misc/FilterTypes'
import { AppContext } from "../../../context/AppContext"
import { log_error } from "../../../utils/utils"
import PropTypes from 'prop-types'


const Specifiers = ({restaurant_search_query}) => {
    const sort_dropdown_ref = useRef()
    const { base_url, restaurants, setRestaurants, setDisplayedRestaurants, searched_address, setIsRecommendedVisible } = useContext(AppContext)

    const SORT_TYPE = {
        NONE: "Best Match",
        PRICE: "Price",
        RATING: "Rating",
        DISTANCE: "Distance",
    }

    const [sort_type, setSortType] = useState(SORT_TYPE.NONE)
    const [is_sort_dropdown, setIsSortDropdown] = useState(false)
    const [selected_filter, setSelectedFilter] = useState('')

    const sort_dropdown_symbol_style = (is_sort_dropdown) ? {"transform": "translate(0%, -5%)"} : {"transform": "translate(0%, -5%)"}

    useEffect(() => {
        handleSortNFilter(sort_type)
    }, [restaurants, selected_filter])

    useEffect(() => {
        // Wrapper for async purposes
        if(searched_address) {
            const fetchRestaurantsWrapper = async () => {
                await fetchRestaurants()
            }
            fetchRestaurantsWrapper()
        }
    }, [searched_address])

    useEffect(() => {
        if(sort_type !== SORT_TYPE.NONE) {
            setIsRecommendedVisible(false)
            return
        }
        else if (restaurant_search_query || selected_filter) {
            setIsRecommendedVisible(false)
            return
        }
        else {
            setIsRecommendedVisible(true)
        }
    }, [searched_address, restaurant_search_query, sort_type, selected_filter])

    // Utility functions
    const fetchRestaurants = async () => {
        let address_query = ''
        if(searched_address) {
            address_query = `&street_address=${encodeURIComponent(searched_address.street_address)}&city=${encodeURIComponent(searched_address.city)}&postal_code=${encodeURIComponent(searched_address.postal_code)}&state=${encodeURIComponent(searched_address.state)}&country=${encodeURIComponent(searched_address.country)}`
        }
        const response = await fetch(base_url + `/restaurant?search_query=${restaurant_search_query}` + address_query, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const err = new Error(`Status: ${response.status}. Failed to initially fetch restaurants`)
        err.status = response.status
        if(!response.ok) throw err
        const restaurant_data = await response.json()
        setRestaurants(restaurant_data)
    }

    // Handlers
    const handleFilterClick = (filter_type) => {
        setSelectedFilter((prev_selected_filter) => (selected_filter === filter_type) ? '' : filter_type)
    }
    const handleSortDropdown = () => {
        setIsSortDropdown((prev_is_sort_dropdown) => !prev_is_sort_dropdown);
    }
    const handleSortNFilter = (sort_type) => {
        const filtered_restaurants = (selected_filter) ? restaurants.filter((restaurant) => restaurant.categories?.includes(selected_filter)) : restaurants
        switch(sort_type) {
            case SORT_TYPE.DISTANCE:
                // Check if a distance has been assigned to the restaurants (may not have if user hasn't typed address yet)
                if(filtered_restaurants && filtered_restaurants[0].distance_value !== null) { // asc
                    const price_sorted_restaurants = filtered_restaurants.slice().sort((a, b) => a.distance_value - b.distance_value)
                    setDisplayedRestaurants(price_sorted_restaurants)
                    setSortType(SORT_TYPE.DISTANCE)
                }
                else setSortType(SORT_TYPE.NONE)
                break
            case SORT_TYPE.PRICE: // descr
                const price_sorted_restaurants = filtered_restaurants.slice().sort((a, b) => a.avg_cost - b.avg_cost)
                setDisplayedRestaurants(price_sorted_restaurants)
                setSortType(SORT_TYPE.PRICE)
                break
            case SORT_TYPE.RATING: // descr
                const rating_sorted_restaurants = filtered_restaurants.slice().sort((a, b) => b.avg_rating - a.avg_rating) 
                setDisplayedRestaurants(rating_sorted_restaurants)
                setSortType(SORT_TYPE.RATING)
                break
            default:
                setDisplayedRestaurants(filtered_restaurants)
                setSortType(SORT_TYPE.NONE)
                break
        }
        setIsSortDropdown(false)
    }

    return (
        <section className="specifiers">
            <section className="filters">
                {
                    cuisine_filters_react_select.map((filter) => (                        
                        <section className="cuisine_filter" style={(selected_filter === filter.value) ? {color: "#f1f1f2", backgroundColor: "#2e2f32"} : {color: "#2e2f32", backgroundColor: "#f1f1f2"}}>
                            <p className="cuisine_filter_text" onClick={() => handleFilterClick(filter.value)}>{filter.label}</p>
                        </section>
                    ))
                }
            </section>
            <section className="sort">
                <p><span style={{fontWeight: "550"}}>Sort By</span> | {sort_type}</p>
                <p className="sort_dropdown" onClick={handleSortDropdown}>▼</p>
                {
                    is_sort_dropdown && 
                        <section className="sort_dropdown_popup">
                            {
                                Object.entries(SORT_TYPE).map(([key, value]) => (
                                    <p className="sort_dropdown_popup_option" onClick={() => handleSortNFilter(value)}>{value}</p>
                                ))
                            }
                        </section>
                }
            </section>
        </section>
    )
}


Specifiers.propTypes = {
    restaurant_search_query: PropTypes.string.isRequired,
};


export default Specifiers
