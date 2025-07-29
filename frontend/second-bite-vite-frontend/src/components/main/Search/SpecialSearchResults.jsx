import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import { AppContext } from '../../../context/AppContext'
import { log_error } from '../../../utils/utils'

const SpecialSearchResults = ({ handleAddressSearchClear }) => {
    const { base_url, setSearchedAddress } = useContext(AppContext)
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
        handleAddressSearchClear()
    }

    return (
        <section className="special_search_results">
            <p className="search_results_title">Saved Addresses</p>
            <section className="special_search_saved_addresses">
                <section className="special_search_saved_address" onClick={() => handleSelectSearchAddress(consumer_address)}>
                    <p className="search_street_address_field">{consumer_address.street_address}</p>
                    <p className="search_other_address_field">{consumer_address.city}, {consumer_address.state}, {consumer_address.country}</p>
                </section>
            </section>
        </section>
    )
}

SpecialSearchResults.propTypes = {
    handleAddressSearchClear: PropTypes.func.isRequired,
}


export default SpecialSearchResults
