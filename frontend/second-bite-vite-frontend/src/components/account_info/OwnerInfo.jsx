import React, { useState, useRef, useContext } from "react"
import { useNavigate } from 'react-router-dom'
import states from "../misc/States"

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { AppContext } from "../../App"

const OwnerInfo = () => {
    const navigate = useNavigate()
    const {setIsAddRestaurantModal} =  useContext(AppContext)

    const [username_msg, setUsernameMsg] = useState('')
    const [password_msg, setPasswordMsg] = useState('')
    const [confirm_password_msg, setConfirmPasswordMsg] = useState('')
    const [street_address_msg, setStreetAddressMsg] = useState('')
    const [city_msg, setCityMsg] = useState('')
    const [postal_code_msg, setPostalCodeMsg] = useState('')
    const [state_msg, setStateMsg] = useState('')
    const [country_msg, setCountryMsg] = useState('')
    const [selected_restaurant, setSelectedRestaurant] = useState('Select Your Restaurant:')

    const form_ref = useRef();
    // TODO: Pre-populate with existing account info

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
    const handleDeleteRestaurant = () => {
        
    }

    return (
        <section className="account_info">
            <form className="account_info_form">
                <button className="account_return_btn" onClick={handleAccountReturn}>←</button>
                <h2 className="text-2xl font-bold mt-6 mb-4" id="account_info_title">Edit Personal info</h2>



                <section className="account_entries">
                    {/* Username, Password, Re-Enter Password */}
                    <section className="account_entry">
                        <p className="auth_text">Username:</p>
                        <input type="text" name="owner_edit_username" className="account_input" placeholder={username_msg} />
                    </section>
                    <section className="account_entry">
                        <p className="auth_text">Password:</p>
                        <input type="text" name="owner_edit_password" className="account_input" placeholder={password_msg} />
                    </section>
                    <section className="account_entry">
                        <p className="auth_text">Confirm Password:</p>
                        <input type="text" name="owner_edit_confirm_password" className="account_input" placeholder={confirm_password_msg} />
                    </section>      

                    <section className="location_account_entries">
                        <section className="location_account_entry">
                            <p className="location_auth_text">Street Address:</p>
                            <input type="text" name="owner_edit_street_address" className="account_input" placeholder={street_address_msg} />
                        </section>
                        <section className="location_account_entry">
                            <p className="location_auth_text">City:</p>
                            <input type="text" name="owner_edit_city" className="account_input" placeholder={city_msg} />
                        </section>
                        <section className="location_account_entry">
                            <p className="location_auth_text">Postal Code:</p>
                            <input type="text" name="owner_edit_postal_code" className="account_input" placeholder={postal_code_msg} />
                        </section>
                        <section className="location_account_entry">
                            <p className="location_auth_text">State:</p>
                            <select name="owner_edit_state" className="account_input">
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
                            <select name="owner_edit_country" className="account_input">
                                <option value="none">{country_msg || 'Select a Country:'}</option>
                                <option value="US">United States</option>
                            </select>
                        </section>
                    </section>

                    {/* Location */}
                    <section className="owner_btns self-start">
                        <Menu as="div" className="relative inline-block text-left self-start">
                        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                            {selected_restaurant}
                            <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                        </MenuButton>
                        <MenuItems
                            transition
                            className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none
                                        data-closed:scale-95 data-closed:transform data-closed:opacity-0
                                        data-enter:duration-100 data-enter:ease-out
                                        data-leave:duration-75 data-leave:ease-in"
                        >
                            <MenuItem onClick={() => {handleRestaurantSelect('Mezze Cafe')}}>
                            {({ active }) => (
                                <a
                                href="#"
                                className={`block px-4 py-2 text-sm text-gray-600 ${
                                    active ? 'bg-gray-100 text-gray-900' : ''
                                }`}
                                >
                                Mezze Cafe
                                </a>
                            )}
                            </MenuItem>
                            <MenuItem onClick={() => {handleRestaurantSelect('Bento Box')}}>
                            {({ active }) => (
                                <a
                                href="#"
                                className={`block px-4 py-2 text-sm text-gray-600 ${
                                    active ? 'bg-gray-100 text-gray-900' : ''
                                }`}
                                >
                                Bento Box
                                </a>
                            )}
                            </MenuItem>
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