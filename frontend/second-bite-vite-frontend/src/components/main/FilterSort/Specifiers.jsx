import React, {useState, useRef, useContext} from "react";
import { cuisine_filters } from '../../misc/FilterTypes'
import { AppContext } from "../../../context/AppContext";

const Specifiers = () => {
    const search_ref = useRef()
    const sort_dropdown_ref = useRef()
    const { restaurants, setRestaurants } = useContext(AppContext)

    const SORT_TYPE = {
        NONE: "Best Match",
        PRICE: "Price",
        RATING: "Rating",
        DISTANCE: "Distance",
    }

    const [sort_type, setSortType] = useState(SORT_TYPE.PRICE)
    const [is_sort_dropdown, setIsSortDropdown] = useState(false)

    const sort_dropdown_symbol_style = (is_sort_dropdown) ? {"transform": "translate(0%, -5%)"} : {"transform": "translate(0%, -5%)"}

    // Handlers
    const handleFilter = () => {
        // TODO: 
    }
    const handleSortDropdown = () => {
        setIsSortDropdown((prev_is_sort_dropdown) => !prev_is_sort_dropdown);
    }
    const handleSort = (sort_type) => {
        switch(sort_type) {
            case SORT_TYPE.DISTANCE:
                // TODO:
                break
            case SORT_TYPE.PRICE:
                // TODO:
                break
            case SORT_TYPE.RATING:
                // TODO:
                break
            default:
                break
        }
    }

    return (
        <section className="specifiers">
            <section className="filters">
                {
                    cuisine_filters.map((filter) => (                        
                        <section className="cuisine_filter">
                            <p className="cuisine_filter_text" onClick={() => handleFilter(filter)}>{filter}</p>
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
