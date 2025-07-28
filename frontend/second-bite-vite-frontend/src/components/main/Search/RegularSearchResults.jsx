import React, {useState, useRef, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import { log_error } from '../../../utils/utils'
import { AppContext } from '../../../context/AppContext'

const RegularSearchResults = ({ address_search_query, handleAddressSearchClear, ADDRESS_SEARCH_CLEAR_TYPE }) => {
    const {setSearchedAddress} = useContext(AppContext)
    const [search_results, setSearchResults] = useState([])

    useEffect(() => {
        const getAddressAutoComplete = async () => {
              try{
                  const address_search_query_encoded = encodeURIComponent(address_search_query)
                  // NOTE: Fetch max four to nicely fit on search results pop-up
                  const response = await fetch(`https://api.radar.io/v1/search/autocomplete?query=${address_search_query_encoded}&countryCode=US&limit=4` , { 
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
        if(address_search_query) {
            getAddressAutoComplete()
        }
    }, [address_search_query])

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
        handleAddressSearchClear(ADDRESS_SEARCH_CLEAR_TYPE.SEARCH)
    }

    return (
        <section className="regular_search_results">
            {
                search_results.map((address) => (
                    <section className="regular_address_search" onClick={() => handleSelectSearchAddress(address)}>
                        <p className="search_street_address_field">{address.number} {address.street}</p>
                        <p className="search_other_address_field">{address.city}, {address.state}, {address.postalCode}</p>
                    </section>
                ))
            }
        </section>
    )
}

RegularSearchResults.propTypes = {
    address_search_query: PropTypes.string.isRequired,
    handleAddressSearchClear: PropTypes.func.isRequired,
    ADDRESS_SEARCH_CLEAR_TYPE: PropTypes.object.isRequired,
}


export default RegularSearchResults