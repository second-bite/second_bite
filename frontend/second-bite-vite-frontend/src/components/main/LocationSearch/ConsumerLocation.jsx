import React, {useState, useRef, useContext} from 'react'
import PropTypes from 'prop-types'

import RegularSearchResults from './RegularSearchResults'
import SpecialSearchResults from './SpecialSearchResults'
import { AppContext } from '../../../context/AppContext'
import { log_error } from '../../../utils/utils'

const ConsumerLocation = () => {
    const form_ref = useRef()
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
    const [search_query, setSearchQuery] = useState('')

    // Handlers
    const handleSpecialSearch = () => {
        setSearchQuery('')
        if(search_popup_status === SEARCH_POPUP_STATUS.NONE || search_popup_status === SEARCH_POPUP_STATUS.REGULAR_SEARCH) {
            setSearchPopupStatus(SEARCH_POPUP_STATUS.SPECIAL_SEARCH)
        }
        else setSearchPopupStatus(SEARCH_POPUP_STATUS.NONE)
    }
    const handleSearchQueryChange = (event) => {
        const search_query_val = event.target.value
        setSearchQuery(search_query_val)
        if(search_query && !search_query_val) setSearchPopupStatus(SEARCH_POPUP_STATUS.NONE)
        else if (search_popup_status !== SEARCH_POPUP_STATUS.REGULAR_SEARCH) {
            setSearchPopupStatus(SEARCH_POPUP_STATUS.REGULAR_SEARCH)
        }
    }
    const handleSearchClear = (clear_type) => {
        setSearchQuery('')
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

    return (
        <section className="consumer_location">
            <section className="starting_address">
                <img src="/location.png" alt="Location Icon" className="location_img"/>
                <p>Choose a Starting Address: </p>
            </section>
            <section className="address_search">
                <form ref={form_ref} className="address_search_form">
                    <input type="text" value={search_query} onChange={handleSearchQueryChange} placeholder="Enter starting address..." className="address_search_text"/>
                    <button type="button" id="clear_address_search" className="address_search_btn" onClick={() => handleSearchClear(ADDRESS_SEARCH_CLEAR_TYPE.CLEAR)}>✖</button>
                    <button type="button" id="submit_address_search" className="address_search_btn">🔍</button>
                    <p className='special_address_dropdown' onClick={(event) => handleSpecialSearch(event)}>▼</p>
                </form>
                {
                    (search_popup_status !== SEARCH_POPUP_STATUS.NONE) &&
                        <section className="search_results_popup">
                            {
                                (search_popup_status === SEARCH_POPUP_STATUS.REGULAR_SEARCH) ?
                                <RegularSearchResults search_query={search_query} handleSearchClear={handleSearchClear} ADDRESS_SEARCH_CLEAR_TYPE={ADDRESS_SEARCH_CLEAR_TYPE}/> : <SpecialSearchResults handleSearchClear={handleSearchClear}/>
                            }
                        </section>
                }
            </section>
        </section>
    )
}


export default ConsumerLocation
