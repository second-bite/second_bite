import React, {useState, useRef} from 'react'
import PropTypes from 'prop-types'

const searched_addresses = [
  {
    "street_address": "4 Privet Drive",
    "city": "Little Whinging",
    "state": "Surrey",
    "postal_code": "CR3 0AA",
    "country": "UK"
  },
  {
    "street_address": "742 Evergreen Terrace",
    "city": "Springfield",
    "state": "??",
    "postal_code": "49007",
    "country": "USA"
  },
  {
    "street_address": "1313 Mockingbird Lane",
    "city": "Mockingbird Heights",
    "state": "CA",
    "postal_code": "90210",
    "country": "USA"
  },
  {
    "street_address": "1 Infinite Loop",
    "city": "Cupertino",
    "state": "CA",
    "postal_code": "95014",
    "country": "USA"
  }
];



const RegularSearchResults = () => {

    // TODO: Add default (if no search results yielded)
    return (
        <section className="regular_search_results">
            {
                searched_addresses.map((address) => (
                    <section className="regular_search_address">
                        <p className="search_street_address_field">{address.street_address}</p>
                        <p className="search_other_address_field">{address.city}, {address.state}, {address.country}</p>
                    </section>
                ))
            }
        </section>
    )
}

RegularSearchResults.propTypes = {

}


export default RegularSearchResults