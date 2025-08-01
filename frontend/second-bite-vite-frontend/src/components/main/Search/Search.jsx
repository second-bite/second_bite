import React, {useState, useRef, useContext} from 'react'
import PropTypes from 'prop-types'

import RegularSearchResults from './RegularSearchResults'
import SpecialSearchResults from './SpecialSearchResults'
import { AppContext } from '../../../context/AppContext'
import { log_error } from '../../../utils/utils'

const Search = ({setRestaurantSearchQuery}) => {
    const form_ref = useRef()
    const search_ref = useRef()
    const {setSearchedAddress} = useContext(AppContext)

    const SEARCH_POPUP_STATUS = {
        NONE: 'none',
        REGULAR_SEARCH: 'regular_search',
        SPECIAL_SEARCH: 'special_search',
    }
    // NOTE: Distinguishes between the two ways the address search pop-up & address search query may be cleared out
    const ADDRESS_SEARCH_CLEAR_TYPE = {
        CLEAR: 'clear',
        SEARCH: 'search',
    }
    const [search_popup_status, setSearchPopupStatus] = useState(SEARCH_POPUP_STATUS.NONE)
    const [address_search_query, setAddressSearchQuery] = useState('')

    // Handlers
    const handleSpecialSearch = () => {
        setAddressSearchQuery('')
        if(search_popup_status === SEARCH_POPUP_STATUS.NONE || search_popup_status === SEARCH_POPUP_STATUS.REGULAR_SEARCH) {
            setSearchPopupStatus(SEARCH_POPUP_STATUS.SPECIAL_SEARCH)
        }
        else setSearchPopupStatus(SEARCH_POPUP_STATUS.NONE)
    }
    const handleAddressSearchQueryChange = (event) => {
        const address_search_query_val = event.target.value
        setAddressSearchQuery(address_search_query_val)
        if(address_search_query && !address_search_query_val) setSearchPopupStatus(SEARCH_POPUP_STATUS.NONE)
        else if (search_popup_status !== SEARCH_POPUP_STATUS.REGULAR_SEARCH) {
            setSearchPopupStatus(SEARCH_POPUP_STATUS.REGULAR_SEARCH)
        }
    }
    const handleAddressSearchClear = (clear_type) => {
        setAddressSearchQuery('')
        setSearchPopupStatus(SEARCH_POPUP_STATUS.NONE)
        switch (clear_type) {
            case ADDRESS_SEARCH_CLEAR_TYPE.CLEAR:
                setSearchedAddress({})
            case ADDRESS_SEARCH_CLEAR_TYPE.SEARCH:
                null
            default:
                const err = new Error(`Status: 422. Failed to update account information.`)
                err.status = 422
                log_error(err)
        }
    }
    const handleRestaurantSearch = async () => {
        const restaurant_search_query = search_ref.current.elements.restaurant_search_query.value
        setRestaurantSearchQuery(restaurant_search_query)
    }

    return (
        <section className="search">
            <section className="address_search_wrap">
                <section className="starting_address">
                    <img src="/location.png" alt="Location Icon" className="location_img"/>
                </section>
                <section className="address_search">
                    <form ref={form_ref} className="address_search_form">
                        <input type="text" value={address_search_query} onChange={handleAddressSearchQueryChange} placeholder="Enter starting address..." className="address_search_text"/>
                        <button type="button" id="clear_address_search" className="address_search_btn" onClick={() => handleAddressSearchClear(ADDRESS_SEARCH_CLEAR_TYPE.CLEAR)}>✖</button>
                        <button type="button" id="submit_address_search" className="address_search_btn">🔍</button>
                        <p className='special_address_dropdown' onClick={(event) => handleSpecialSearch(event)}>▼</p>
                    </form>
                    {
                        (search_popup_status !== SEARCH_POPUP_STATUS.NONE) &&
                            <section className="search_results_popup">
                                {
                                    (search_popup_status === SEARCH_POPUP_STATUS.REGULAR_SEARCH) ?
                                    <RegularSearchResults address_search_query={address_search_query} handleAddressSearchClear={handleAddressSearchClear} ADDRESS_SEARCH_CLEAR_TYPE={ADDRESS_SEARCH_CLEAR_TYPE}/> : <SpecialSearchResults handleAddressSearchClear={handleAddressSearchClear}/>
                                }
                            </section>
                    }
                </section>
            </section>
            <section className="restaurant_search">
                <form className="restaurant_search_form" ref={search_ref}>
                    <span className="restaurant_search_icon" onClick={handleRestaurantSearch}>🔍</span>
                    <input type="text" className="restaurant_search_input" name="restaurant_search_query" placeholder="Search for restaurants..."/>
                </form>
            </section>
        </section>
    )
}


Search.propTypes = {
    restaurant_search_query: PropTypes.string.isRequired,
    setRestaurantSearchQuery: PropTypes.func.isRequired,
};


export default Search
