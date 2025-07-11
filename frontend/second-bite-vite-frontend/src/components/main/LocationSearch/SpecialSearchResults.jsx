import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import { AppContext } from '../../../context/AppContext'
import { log_error } from '../../../utils/utils'

// const saved_addresses = [
//   {
//     "street_address": "1 Hacker Way",
//     "city": "Menlo Park",
//     "state": "CA",
//     "postal_code": "94025",
//     "country": "USA"
//   },
//   {
//     "street_address": "456 Oak Avenue",
//     "city": "Portland",
//     "state": "OR",
//     "postal_code": "97205",
//     "country": "USA"
//   }
// ]


const recent_addresses = [
  {
    "street_address": "1600 Amphitheatre Parkway",
    "city": "Mountain View",
    "state": "CA",
    "postal_code": "94043",
    "country": "USA"
  },
  {
    "street_address": "1 Apple Park Way",
    "city": "Cupertino",
    "state": "CA",
    "postal_code": "95014",
    "country": "USA"
  }
]


const SpecialSearchResults = ({ setSearchedAddress, handleSearchClear }) => {
    const { base_url } = useContext(AppContext)
    const [ consumer_address, setConsumerAddress ] = useState({})

    // Add user's saved restaurant here
    useEffect(() => {
        const fetchConsumerAddress = async () => {
            try {
              const response = await fetch(base_url + '/consumer', {
                  method: 'GET',
                  credentials: 'include',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              })
              const err = new Error(`Status: ${response.status}. Failed to fetch logged in consumer's info`)
              err.status = response.status
              if(!response.ok) throw err
              const { address } = await response.json()
              setConsumerAddress(address)
            } catch (err) {
                await log_error(err)
            }
        }

        fetchConsumerAddress()
    }, [])

    // Handlers
    const handleSelectSearchAddress = (address) => {
        setSearchedAddress(address)
        handleSearchClear()
    }

    return (
        <section className="special_search_results">
            <p className="search_results_title">Saved Addresses</p>
            <section className="special_search_saved_addresses">
                <section className="special_search_saved_address" onClick={() => handleSelectSearchAddress(consumer_address)}>
                    <p className="search_street_address_field">{consumer_address.street_address}</p>
                    <p className="search_other_address_field">{consumer_address.city}, {consumer_address.state}, {consumer_address.country}</p>
                </section>
                {/* {
                    saved_addresses.map((address) => (
                        <section className="special_search_saved_address">
                            <p className="search_street_address_field">{address.street_address}</p>
                            <p className="search_other_address_field">{address.city}, {address.state}, {address.country}</p>
                        </section>
                    ))
                } */}
            </section>
            <p className="search_results_title">Recent Addresses</p>
            <section className="special_search_recent_addresses">
                {
                    recent_addresses.map((address) => (
                        <section className="special_search_recent_address">
                            <p className="search_street_address_field">{address.street_address}</p>
                            <p className="search_other_address_field">{address.city}, {address.state}, {address.country}</p>
                        </section>
                    ))
                }
            </section>
        </section>
    )
}

SpecialSearchResults.propTypes = {
    setSearchedAddress: PropTypes.func.isRequired,
    handleSearchClear: PropTypes.func.isRequired,
}


export default SpecialSearchResults
