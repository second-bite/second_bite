import React, {useRef} from "react";
import cuisine_filters from '../../misc/FilterTypes'

const FilterSort = () => {
    const sort_dropdown_ref = useRef()

    const handleSort = () => {
        const sort_type = sort_dropdown_ref.current.elements.value
        // TODO: Add sorting functionality
    }

    return (
        <section className="filter_n_sort">
            <section className="filters">
                {
                    cuisine_filters.map((filter) => (                        
                        <section className="cuisine_filter">
                            <p className="cuisine_filter_text">{filter}</p>
                        </section>
                    ))
                }
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
    )
}


export default FilterSort
