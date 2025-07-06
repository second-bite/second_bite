import React, {useState, useRef, useContext, useEffect} from "react"
import { cuisine_filters_react_select } from '../../misc/FilterTypes'
import { AppContext } from "../../../context/AppContext"
import PropTypes from 'prop-types'

const Specifiers = ({setSearchQuery}) => {
    const search_ref = useRef()
    const sort_dropdown_ref = useRef()
    const { base_url, restaurants, setRestaurants, displayed_restaurants, setDisplayedRestaurants } = useContext(AppContext)

    const SORT_TYPE = {
        NONE: "Best Match",
        PRICE: "Price",
        RATING: "Rating",
        DISTANCE: "Distance",
    }

    const [sort_type, setSortType] = useState(SORT_TYPE.PRICE)
    const [is_sort_dropdown, setIsSortDropdown] = useState(false)
    const [selected_filter, setSelectedFilter] = useState('')

    const sort_dropdown_symbol_style = (is_sort_dropdown) ? {"transform": "translate(0%, -5%)"} : {"transform": "translate(0%, -5%)"}

    useEffect(() => {
        handleSort(sort_type)
    }, [restaurants, selected_filter])

    const filterRestaurants = (selected_filter) => {
        const filtered_restaurants = (selected_filter) ? restaurants.filter((restaurant) => restaurant.categories?.includes(selected_filter)) : restaurants
        setDisplayedRestaurants(filtered_restaurants)
    }

    // Handlers
    const handleFilterClick = (filter_type) => {
        if(selected_filter === filter_type) setSelectedFilter('') // Clear filter
        else setSelectedFilter(filter_type)
    }
    const handleSearch = async () => {
        console.log('handleSearch called')
        try{
            const search_query = search_ref.current.elements.search_query.value
            const response = await fetch(base_url + `/restaurant?search_query=${search_query}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if(!response.ok) throw new Error(`Status: ${response.status}. Failed to initially fetch restaurants`)
            const restaurant_data = await response.json()
            setRestaurants(restaurant_data)
            setSearchQuery(search_query)
        } catch (err) {
            console.error('Error: ', err)
        }
    }
    const handleSortDropdown = () => {
        setIsSortDropdown((prev_is_sort_dropdown) => !prev_is_sort_dropdown);
    }
    const handleSort = (sort_type) => {
        switch(sort_type) {
            case SORT_TYPE.DISTANCE:
                // Check if a distance has been assigned to the restaurants (may not have if user hasn't typed address yet)
                if(restaurants && restaurants[0].distance_value !== null) { // asc
                    const price_sorted_restaurants = restaurants.slice().sort((a, b) => a.distance_value - b.distance_value)
                    setDisplayedRestaurants(price_sorted_restaurants)
                    setSortType(SORT_TYPE.DISTANCE)
                }
                else setSortType(SORT_TYPE.NONE)
                break
            case SORT_TYPE.PRICE: // descr
                const price_sorted_restaurants = restaurants.slice().sort((a, b) => a.avg_cost - b.avg_cost)
                setDisplayedRestaurants(price_sorted_restaurants)
                setSortType(SORT_TYPE.PRICE)
                break
            case SORT_TYPE.RATING: // descr
                const rating_sorted_restaurants = restaurants.slice().sort((a, b) => b.avg_rating - a.avg_rating) 
                setDisplayedRestaurants(rating_sorted_restaurants)
                setSortType(SORT_TYPE.RATING)
                break
            default:
                setDisplayedRestaurants(restaurants)
                setSortType(SORT_TYPE.NONE)
                break
        }
        filterRestaurants(selected_filter)
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
            <section className="search_n_sort">
                <section className="search">
                    <form className="search_form" ref={search_ref}>
                        <span className="restaurant_search_icon" onClick={handleSearch}>🔍</span>
                        <input type="text" className="restaurant_search_input" name="search_query" placeholder="Search for restaurants..."/>
                    </form>
                </section>
                <section className="sort">
                    <p><span style={{fontWeight: "550"}}>Sort By</span> | {sort_type}</p>
                    <p className="sort_dropdown" onClick={handleSortDropdown}>{(is_sort_dropdown) ? "⌃" : "⌄"}</p>
                    {
                        is_sort_dropdown && 
                            <section className="sort_dropdown_popup">
                                {
                                    Object.entries(SORT_TYPE).map(([key, value]) => (
                                        <p className="sort_dropdown_popup_option" onClick={() => handleSort(value)}>{value}</p>
                                    ))
                                }
                            </section>
                    }
                </section>
            </section>
        </section>
    )
}

Specifiers.propTypes = {
    setSearchQuery: PropTypes.func.isRequired,
};


export default Specifiers
