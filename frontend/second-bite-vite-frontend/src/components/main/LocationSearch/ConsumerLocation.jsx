import React, {useState, useRef} from 'react'
import PropTypes from 'prop-types'

import RegularSearchResults from './RegularSearchResults'
import SpecialSearchResults from './SpecialSearchResults'

const ConsumerLocation = () => {
    const form_ref = useRef()

    const search_popup_status_enum = {
        NONE: 'none',
        REGULAR_SEARCH: 'regular_search',
        SPECIAL_SEARCH: 'special_search',
    }
    const [search_popup_status, setSearchPopupStatus] = useState(search_popup_status_enum.NONE)
    const [search_query, setSearchQuery] = useState('');

    // Handlers
    const handleSpecialSearch = async () => {
        await setSearchQuery('')
        if(search_popup_status === search_popup_status_enum.NONE || search_popup_status === search_popup_status_enum.REGULAR_SEARCH) {
            await setSearchPopupStatus(search_popup_status_enum.SPECIAL_SEARCH)
        }
        else await setSearchPopupStatus(search_popup_status_enum.NONE)
    }
    const handleSearchQueryChange = (event) => {
        // 
        if(search_query && !event.target.value) setSearchPopupStatus(search_popup_status_enum.NONE)
        else if (search_popup_status !== search_popup_status_enum.REGULAR_SEARCH) {
            setSearchPopupStatus(search_popup_status_enum.REGULAR_SEARCH)
        }
        // TODO: Add actual dynamic search results as search changes
    }
    const handleSearchClear = async () => {
        await setSearchQuery('')
        await setSearchPopupStatus(search_popup_status_enum.NONE)
    }

    return (
        <section className="consumer_location">
            <section className="starting_address">
                <img src="/location.png" alt="Location Icon" className="location_img"/>
                <p>Choose a Starting Address: </p>
            </section>
            <section className="address_search">
                <form ref={form_ref} className="address_search_form">
                    <input type="text" value={search_query} onChange={handleSearchQueryChange} placeholder="Enter starting address..." className="address_search_text"/>
                    <button type="button" id="clear_address_search" className="address_search_btn" onClick={handleSearchClear}>✖</button>
                    <button type="submit" id="submit_address_search" className="address_search_btn">🔍</button>
                    <p className='special_address_dropdown' onClick={(event) => handleSpecialSearch(event)}>▼</p>
                </form>
                {
                    (search_popup_status !== search_popup_status_enum.NONE) &&
                        <section className="search_results_popup">
                            {
                                (search_popup_status === search_popup_status_enum.REGULAR_SEARCH) ?
                                <RegularSearchResults /> : <SpecialSearchResults />
                            }
                        </section>
                }
            </section>
        </section>
    )
}

ConsumerLocation.propTypes = {

}


export default ConsumerLocation
