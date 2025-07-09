import React, {useState, useRef, useEffect} from 'react'
import PropTypes from 'prop-types'
import { log_error } from '../../../utils/utils'

const RegularSearchResults = ({ search_query, setSearchedAddress, handleSearchClear }) => {
    const [search_results, setSearchResults] = useState([])

    useEffect(() => {
        const getAddressAutoComplete = async () => {
              try{
                  const search_query_encoded = encodeURIComponent(search_query)
                  // NOTE: Fetch max four to nicely fit on search results pop-up
                  const response = await fetch(`https://api.radar.io/v1/search/autocomplete?query=${search_query_encoded}&countryCode=US&limit=4` , { 
                    headers: {
                        'Authorization': `${import.meta.env.VITE_RADAR_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                  })
                  const err = new Error(`Status: ${response.status}. Failed to Radar address autocomplete`)
                  err.status = response.status
                  if(!response.ok) throw err
                  const { addresses } = await response.json()
                  setSearchResults(addresses)
              } catch (err) {
                  await (err)
              }
        }
        if(search_query) {
            getAddressAutoComplete()
        }
    }, [search_query])

    // Handlers
    const handleSelectSearchAddress = (address) => {
        const reformatted_address = {
            street_address: `${address.number} ${address.street}`,
            city: address.city,
            postal_code: address.postalCode,
            state: address.state,
            country: address.countryCode,
        }
        setSearchedAddress(reformatted_address)
        handleSearchClear()
    }

    return (
        <section className="regular_search_results">
            {
                search_results.map((address) => (
                    <section className="regular_search_address" onClick={() => handleSelectSearchAddress(address)}>
                        <p className="search_street_address_field">{address.number} {address.street}</p>
                        <p className="search_other_address_field">{address.city}, {address.state}, {address.postalCode}</p>
                    </section>
                ))
            }
        </section>
    )
}

RegularSearchResults.propTypes = {
    search_query: PropTypes.string.isRequired,
    setSearchedAddress: PropTypes.func.isRequired,
    handleSearchClear: PropTypes.func.isRequired,
}


export default RegularSearchResults