import React, {useState, useRef} from 'react'
import PropTypes from 'prop-types'

const saved_addresses = [
  {
    "street_address": "1 Hacker Way",
    "city": "Menlo Park",
    "state": "CA",
    "postal_code": "94025",
    "country": "USA"
  },
  {
    "street_address": "456 Oak Avenue",
    "city": "Portland",
    "state": "OR",
    "postal_code": "97205",
    "country": "USA"
  }
]


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


const SpecialSearchResults = () => {

    return (
        <section className="special_search_results">
            <p className="search_results_title">Saved Addresses</p>
            <section className="special_search_saved_addresses">
                {
                    saved_addresses.map((address) => (
                        <section className="special_search_saved_address">
                            <p className="search_street_address_field">{address.street_address}</p>
                            <p className="search_other_address_field">{address.city}, {address.state}, {address.country}</p>
                        </section>
                    ))
                }
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

}


export default SpecialSearchResults
