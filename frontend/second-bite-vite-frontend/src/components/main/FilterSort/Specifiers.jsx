import React, {useState, useRef} from "react";
import cuisine_filters from '../../misc/FilterTypes'

const Specifiers = () => {
    const search_ref = useRef()
    const sort_dropdown_ref = useRef()

    const sort_types_enum = {
        none: "Best Match",
        price: "Price",
        rating: "Rating",
        distance: "Distance",
    }

    const [sort_type, setSortType] = useState(sort_types_enum.price)
    const [is_sort_dropdown, setIsSortDropdown] = useState(false)

    const handleSortDropdown = () => {
        setIsSortDropdown((prev_is_sort_dropdown) => !prev_is_sort_dropdown);
    }

    return (
        <section className="specifiers">
            <section className="filters">
                {
                    cuisine_filters.map((filter) => (                        
                        <section className="cuisine_filter">
                            <p className="cuisine_filter_text">{filter}</p>
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
                    <p className="sort_dropdown" onClick={handleSortDropdown}>⌄</p>
                    {
                        is_sort_dropdown && 
                            <section className="sort_dropdown_popup">
                                {
                                    sort_types_enum.map((sort_type) => (
                                        <p className="sort_dropdown_popup_option">{sort_types_enum}</p>
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
