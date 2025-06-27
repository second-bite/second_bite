import React, {useRef} from "react";
import cuisine_filters from '../../misc/FilterTypes'

const Specifiers = () => {
    const search_ref = useRef()
    const sort_dropdown_ref = useRef()

    const handleSort = () => {
        const sort_type = sort_dropdown_ref.current.elements.value
        // TODO: Add sorting functionality
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
                    <select className="sort_dropdown" ref={sort_dropdown_ref} onChange={handleSort}>
                        <option value="none">Sort by:</option>
                        <option value="price">Price</option>
                        <option value="distance">Distance</option>
                        <option value="rating">Rating</option>
                    </select>
                </section>
            </section>
        </section>
    )
}


export default Specifiers
