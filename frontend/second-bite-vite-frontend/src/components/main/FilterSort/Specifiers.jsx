import React, {useState, useRef, useContext, useEffect} from "react";
import { cuisine_filters } from '../../misc/FilterTypes'
import { AppContext } from "../../../context/AppContext";

const Specifiers = () => {
    const search_ref = useRef()
    const sort_dropdown_ref = useRef()
    const { restaurants, setRestaurants, displayed_restaurants, setDisplayedRestaurants } = useContext(AppContext)

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

    // Category filtering performed on frontend to prevent excessive API usage (preserves sorted order)
    useEffect(() => {
        const filtered_restaurants = (selected_filter) ? restaurants.filter((restaurant) => restaurant.categories?.includes(selected_filter)) : restaurants
        setDisplayedRestaurants(filtered_restaurants)
    }, [restaurants, selected_filter])

    // Handlers
    const handleFilterClick = (filter_type) => {
        if(selected_filter === filter_type) setSelectedFilter('') // Clear filter
        else setSelectedFilter(filter_type)
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
                    setRestaurants(price_sorted_restaurants)
                    setSortType(SORT_TYPE.DISTANCE)
                }
                else setSortType(SORT_TYPE.NONE)
                break
            case SORT_TYPE.PRICE: // descr
                const price_sorted_restaurants = restaurants.slice().sort((a, b) => b.avg_cost - a.avg_cost)
                setRestaurants(price_sorted_restaurants)
                setSortType(SORT_TYPE.PRICE)
                break
            case SORT_TYPE.RATING: // descr
                const rating_sorted_restaurants = restaurants.slice().sort((a, b) => b.avg_rating - a.avg_rating) 
                setRestaurants(rating_sorted_restaurants)
                setSortType(SORT_TYPE.RATING)
                break
            default:
                setSortType(SORT_TYPE.NONE)
                break
        }
        setIsSortDropdown(false)
    }

    return (
        <section className="specifiers">
            <section className="filters">
                {
                    cuisine_filters.map((filter) => (                        
                        <section className="cuisine_filter" style={(selected_filter === filter) ? {color: "#f1f1f2", backgroundColor: "#2e2f32"} : {color: "#2e2f32", backgroundColor: "#f1f1f2"}}>
                            <p className="cuisine_filter_text" onClick={() => handleFilterClick(filter)}>{filter}</p>
                        </section>
                    ))
                }
            </section>
            <section className="search_n_sort">
                <section className="search">
                    <form className="search_form" ref={search_ref}>
                        <span className="restaurant_search_icon">🔍</span>
                        <input type="text" className="restaurant_search_input" placeholder="Search for restaurants..."/>
                    </form>
                </section>
                <section className="sort">
                    <p><span style={{"font-weight": "550"}}>Sort By</span> | {sort_type}</p>
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


export default Specifiers
