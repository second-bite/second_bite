import React, { useState, useRef } from "react"
import { useNavigate } from 'react-router-dom'
import states from "../misc/States"


const AccountInfo = () => {
    const navigate = useNavigate()

    const [username_msg, setUsernameMsg] = useState('')
    const [password_msg, setPasswordMsg] = useState('')
    const [confirm_password_msg, setConfirmPasswordMsg] = useState('')
    const [street_address_msg, setStreetAddressMsg] = useState('')
    const [city_msg, setCityMsg] = useState('')
    const [postal_code_msg, setPostalCodeMsg] = useState('')
    const [state_msg, setStateMsg] = useState('')
    const [country_msg, setCountryMsg] = useState('')

    const form_ref = useRef();
    // TODO: Pre-populate with existing account info

    // Handlers
    const handleAccountReturn = () => {
        navigate('/main')
    }

    return (
        <section className="account_info">
            <form className="account_info_form">
                <button type="button" className="account_return_btn" onClick={handleAccountReturn}>←</button>
                <h2 className="text-2xl font-bold mt-6 mb-4" id="account_info_title">Edit Personal info</h2>



                <section className="account_entries">
                    {/* Username, Password, Re-Enter Password */}
                    <section className="account_entry">
                        <p className="auth_text">Username:</p>
                        <input type="text" name="consumer_edit_username" className="account_input" placeholder={username_msg} />
                    </section>
                    <section className="account_entry">
                        <p className="auth_text">Password:</p>
                        <input type="text" name="consumer_edit_password" className="account_input" placeholder={password_msg} />
                    </section>
                    <section className="account_entry">
                        <p className="auth_text">Confirm Password:</p>
                        <input type="text" name="consumer_edit_confirm_password" className="account_input" placeholder={confirm_password_msg} />
                    </section>
                    {/* Location */}
                    <section className="location_account_entries">
                        <section className="location_account_entry">
                            <p className="location_auth_text">Street Address:</p>
                            <input type="text" name="consumer_edit_street_address" className="account_input" placeholder={street_address_msg} />
                        </section>
                        <section className="location_account_entry">
                            <p className="location_auth_text">City:</p>
                            <input type="text" name="consumer_edit_city" className="account_input" placeholder={city_msg} />
                        </section>
                        <section className="location_account_entry">
                            <p className="location_auth_text">Postal Code:</p>
                            <input type="text" name="consumer_edit_postal_code" className="account_input" placeholder={postal_code_msg} />
                        </section>
                        <section className="location_account_entry">
                            <p className="location_auth_text">State:</p>
                            <select name="consumer_edit_state" className="account_input">
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
                            <select name="consumer_edit_country" className="account_input">
                                <option value="none">{country_msg || 'Select a Country:'}</option>
                                <option value="US">United States</option>
                            </select>
                        </section>
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


export default AccountInfo