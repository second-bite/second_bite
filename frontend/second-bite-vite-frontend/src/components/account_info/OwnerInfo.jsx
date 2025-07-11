import React, { useState, useRef, useContext, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import states from "../misc/States"

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { AppContext } from "../../context/AppContext"

const OwnerInfo = () => {
    const navigate = useNavigate()
    const {base_url, setIsAddRestaurantModal} =  useContext(AppContext)

    // State variables
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [city, setCity] = useState('')
    const [postal_code, setPostalCode] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [owned_restaurants, setOwnedRestaurants] = useState([]) // Array of owned restaurants

    // Missing fields error messages
    const [username_msg, setUsernameMsg] = useState('')
    const [password_msg, setPasswordMsg] = useState('')
    const [confirm_password_msg, setConfirmPasswordMsg] = useState('')
    const [street_address_msg, setStreetAddressMsg] = useState('')
    const [city_msg, setCityMsg] = useState('')
    const [postal_code_msg, setPostalCodeMsg] = useState('')
    const [state_msg, setStateMsg] = useState('')
    const [country_msg, setCountryMsg] = useState('')

    const [selected_restaurant, setSelectedRestaurant] = useState({})

    const form_ref = useRef();
    // TODO: Pre-populate with existing account info

    const getOwnerInfo = async () => {
        // Fetch owner info from DB
        const response = await fetch(base_url + '/owner', {
            method: 'GET',
            credentials: 'include'
        })
        const res_json = await response.json()
        if(!response.ok) {
            console.error(res_json)
        }
        // Set state variables
        setUsername(res_json.username)
        setPassword(res_json.password)
        setConfirmPassword(res_json.password)
        setStreetAddress(res_json.address.street_address)
        setCity(res_json.address.city)
        setPostalCode(res_json.address.postal_code)
        setState(res_json.address.state)
        setCountry(res_json.address.country)
        setOwnedRestaurants(res_json.restaurants)
    }

    useEffect(() => {
        getOwnerInfo()
    }, [])


    // Handlers
    const handleAccountReturn = () => {
        navigate('/analytics')
    }
    const handleRestaurantSelect = (selected_restaurant) => {
        setSelectedRestaurant(selected_restaurant)
    }
    const handleAddRestaurant = () => {
        setIsAddRestaurantModal(true)
    }
    const handleDeleteRestaurant = async () => {
        if(selected_restaurant) {
            const response = await fetch(base_url + `/restaurant/${selected_restaurant.restaurant_id}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            const res_json = await response.json()
            console.log(res_json)
            await getOwnerInfo()
            setSelectedRestaurant({})
        }
    }
    const handleAccountInfoSave = () => {
        event.preventDefault()
    }

    return (
        <section className="account_info">
            <form className="account_info_form" onSubmit={handleAccountInfoSave}>
                <button type="button" className="account_return_btn" onClick={handleAccountReturn}>←</button>
                <h2 className="text-2xl font-bold mt-6 mb-4" id="account_info_title">Edit Personal info</h2>


                <section className="account_entries">
                    {/* Username, Password, Re-Enter Password */}
                    <section className="account_entry">
                        <p className="auth_text">Username:</p>
                        <input type="text" name="owner_edit_username" className="account_input" placeholder={username_msg} value={username} onChange={event => setUsername(event.target.value)}/>
                    </section>
                    <section className="account_entry">
                        <p className="auth_text">Password:</p>
                        <input type="password" name="owner_edit_password" className="account_input" placeholder={password_msg} value={password} onChange={event => setPassword(event.target.value)}/>
                    </section>
                    <section className="account_entry">
                        <p className="auth_text">Confirm Password:</p>
                        <input type="password" name="owner_edit_confirm_password" className="account_input" placeholder={confirm_password_msg} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)}/>
                    </section>      

                    <section className="location_account_entries">
                        <section className="location_account_entry">
                            <p className="location_auth_text">Street Address:</p>
                            <input type="text" name="owner_edit_street_address" className="account_input" placeholder={street_address_msg} value={streetAddress} onChange={event => setStreetAddress(event.target.value)}/>
                        </section>
                        <section className="location_account_entry">
                            <p className="location_auth_text">City:</p>
                            <input type="text" name="owner_edit_city" className="account_input" placeholder={city_msg} value={city} onChange={event => setCity(event.target.value)}/>
                        </section>
                        <section className="location_account_entry">
                            <p className="location_auth_text">Postal Code:</p>
                            <input type="text" name="owner_edit_postal_code" className="account_input" placeholder={postal_code_msg} value={postal_code} onChange={event => setPostalCode(event.target.value)}/>
                        </section>
                        <section className="location_account_entry">
                            <p className="location_auth_text">State:</p>
                            <select name="owner_edit_state" className="account_input" value={state} onChange={event => setState(event.target.value)}>
                                <option value="none">{state_msg || 'Select a State:'}</option>
                                {states.map((state) => (
                                    <option key={state.abbreviation} value={state.abbreviation}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </section>
                        <section className="location_account_entry">
                            <p className="location_auth_text">Country:</p>
                            <select name="owner_edit_country" className="account_input" value={country} onChange={event => setCountry(event.target.value)}>
                                <option value="none">{country_msg || 'Select a Country:'}</option>
                                <option value="US">United States</option>
                            </select>
                        </section>
                    </section>

                    {/* Location */}
                    <section className="owner_btns self-start">
                        <Menu as="div" className="relative inline-block text-left self-start">
                        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                            {selected_restaurant.name || "Select a Restaurant"}
                            <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                        </MenuButton>
                        <MenuItems
                            transition
                            className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none
                                        data-closed:scale-95 data-closed:transform data-closed:opacity-0
                                        data-enter:duration-100 data-enter:ease-out
                                        data-leave:duration-75 data-leave:ease-in"
                        >
                            <MenuItem key={-1} onClick={() => {handleRestaurantSelect({})}}>
                            {({ active }) => (
                                <a
                                href="#"
                                className={`block px-4 py-2 text-sm text-gray-600 ${active ? 'bg-gray-100 text-gray-900' : ''}`}
                                >
                                Select a Restaurant:
                                </a>
                            )}
                            </MenuItem>
                            {
                                owned_restaurants.map((restaurant) => (
                                    <MenuItem key={restaurant.restaurant_id} onClick={() => {handleRestaurantSelect(restaurant)}}>
                                    {({ active }) => (
                                        <a
                                        href="#"
                                        className={`block px-4 py-2 text-sm text-gray-600 ${active ? 'bg-gray-100 text-gray-900' : ''}`}
                                        >
                                        {restaurant.name}
                                        </a>
                                    )}
                                    </MenuItem>
                                ))
                            }
                        </MenuItems>
                        </Menu>  
                        <button type="button" className="add_restaurant_btn" onClick={handleAddRestaurant}>+</button>
                        <button type="button" className="delete_restaurant_btn" onClick={handleDeleteRestaurant}>🗑</button>
                    </section>  

                    <section className="account_submit_btns">
                        <button type="button" className="account_clear_btn">Cancel</button>
                        <button type="submit" className="account_submit_btn">Save Profile</button>
                    </section>
                </section>
            </form>
        </section>
    )
}

export default OwnerInfo
