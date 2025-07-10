import React, { useState, useRef, useEffect, useContext } from "react"
import { useNavigate } from 'react-router-dom'
import states from "../misc/States"
import { AppContext } from "../../context/AppContext"


const AccountInfo = () => {
    const navigate = useNavigate()

    const { base_url } = useContext(AppContext)

    // State variables
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [city, setCity] = useState('')
    const [postal_code, setPostalCode] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [server_error_msg, setServerErrorMsg] = useState('')

    // Missing fields error messages
    const [username_msg, setUsernameMsg] = useState('')
    const [password_msg, setPasswordMsg] = useState('')
    const [confirm_password_msg, setConfirmPasswordMsg] = useState('')
    const [street_address_msg, setStreetAddressMsg] = useState('')
    const [city_msg, setCityMsg] = useState('')
    const [postal_code_msg, setPostalCodeMsg] = useState('')
    const [state_msg, setStateMsg] = useState('')
    const [country_msg, setCountryMsg] = useState('')

    const form_ref = useRef();

    const getConsumerInfo = async () => {
        // Fetch owner info from DB
        let data
        try {
            const response = await fetch(base_url + '/consumer', {
                method: 'GET',
                credentials: 'include',
            })
            const err = new Error(`Status: ${response.status}. Failed to retrieve owner info from DB`)
            err.status = response.status
            if(!response.ok) throw err
            data = await response.json()
        } catch (err) {
            await log_error(err)
        }
        // Set state variables
        setUsername(data.username)
        setPassword(data.password)
        setConfirmPassword(data.password)
        setStreetAddress(data.address.street_address)
        setCity(data.address.city)
        setPostalCode(data.address.postal_code)
        setState(data.address.state)
        setCountry(data.address.country)
        setOwnedRestaurants(data.restaurants)
    }

    useEffect(() => {
        getConsumerInfo()
    }, [])

    // Handlers
    const handleAccountReturn = () => {
        navigate('/main')
    }
    const handleCancel = async () => {
        await getOwnerInfo()
    }
    const handleAccountInfoSave = () => {
        
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
                        <input type="text" name="consumer_edit_username" className="account_input" placeholder={username_msg} value={username} onChange={event => setUsername(event.target.value)} />
                    </section>
                    <section className="account_entry">
                        <p className="auth_text">Password:</p>
                        <input type="password" name="consumer_edit_password" className="account_input" placeholder={password_msg} value={password} onChange={event => setPassword(event.target.value)} />
                    </section>
                    <section className="account_entry">
                        <p className="auth_text">Confirm Password:</p>
                        <input type="password" name="consumer_edit_confirm_password" className="account_input" placeholder={confirm_password_msg} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
                    </section>
                    {/* Location */}
                    <section className="location_account_entries">
                        <section className="location_account_entry">
                            <p className="location_auth_text">Street Address:</p>
                            <input type="text" name="consumer_edit_street_address" className="account_input" placeholder={street_address_msg} value={streetAddress} onChange={event => setStreetAddress(event.target.value)} />
                        </section>
                        <section className="location_account_entry">
                            <p className="location_auth_text">City:</p>
                            <input type="text" name="consumer_edit_city" className="account_input" placeholder={city_msg} value={city} onChange={event => setCity(event.target.value)} />
                        </section>
                        <section className="location_account_entry">
                            <p className="location_auth_text">Postal Code:</p>
                            <input type="text" name="consumer_edit_postal_code" className="account_input" placeholder={postal_code_msg} value={postal_code} onChange={event => setPostalCode(event.target.value)} />
                        </section>
                        <section className="location_account_entry">
                            <p className="location_auth_text">State:</p>
                            <select name="consumer_edit_state" className="account_input" value={state} onChange={event => setState(event.target.value)} >
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
                            <select name="consumer_edit_country" className="account_input" value={country} onChange={event => setCountry(event.target.value)} >
                                <option value="none">{country_msg || 'Select a Country:'}</option>
                                <option value="US">United States</option>
                            </select>
                        </section>
                    </section>
                    <section className="account_submit_btns">
                        <button type="button" className="account_clear_btn" onClick={() => handleCancel()}>Cancel</button>
                        <button type="submit" className="account_submit_btn">Save Profile</button>
                    </section>
                </section>
            </form>
        </section>
    )
}


export default AccountInfo