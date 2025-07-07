import React, {useState, useRef, useEffect} from 'react'
import PropTypes from 'prop-types'

// const searched_addresses = [
//   {
//     "street_address": "4 Privet Drive",
//     "city": "Little Whinging",
//     "state": "Surrey",
//     "postal_code": "CR3 0AA",
//     "country": "UK"
//   },
//   {
//     "street_address": "742 Evergreen Terrace",
//     "city": "Springfield",
//     "state": "??",
//     "postal_code": "49007",
//     "country": "USA"
//   },
//   {
//     "street_address": "1313 Mockingbird Lane",
//     "city": "Mockingbird Heights",
//     "state": "CA",
//     "postal_code": "90210",
//     "country": "USA"
//   },
//   {
//     "street_address": "1 Infinite Loop",
//     "city": "Cupertino",
//     "state": "CA",
//     "postal_code": "95014",
//     "country": "USA"
//   }
// ];

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
                  if(!response.ok) throw new Error(`Status: ${response.status}. Failed to Radar address autocomplete`)
                  const { addresses } = await response.json()
                  setSearchResults(addresses)
              } catch (err) {
                  console.error('Error: ', err)
              }
        }
        if(search_query) {
            getAddressAutoComplete()
        }
    }, [search_query])

    // Handlers
    const handleSelectSearchAddress = (address) => {
        setSearchedAddress(address)
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