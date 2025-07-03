import React, {useState, useRef, useContext} from 'react'
import PropTypes from 'prop-types'
import states from '../misc/States'
import { AppContext } from '../../context/AppContext'
import { address_validation } from '../../utils/api'

const SignUpForm = ({auth_form_title, FORM_TYPE, setFormStatus}) => {
    const form_ref = useRef()

    const {base_url} = useContext(AppContext)

    // State Vars
    const [is_account_type_toggled, setIsAccountTypeToggled] = useState(false)
    const [server_error_msg, setServerErrorMsg] = useState('')

    // Required Field Error Msgs
    const [username_msg, setUsernameMsg] = useState('')
    const [password_msg, setPasswordMsg] = useState('')
    const [confirm_password_msg, setConfirmPasswordMsg] = useState('')
    const [street_address_msg, setStreetAddressMsg] = useState('')
    const [city_msg, setCityMsg] = useState('')
    const [postal_code_msg, setPostalCodeMsg] = useState('')
    const [state_msg, setStateMsg] = useState('')
    const [country_msg, setCountryMsg] = useState('')
    
    const handleSignUp = async (event) => {
        event.preventDefault()

        // Ensure all required fields are filled
        const form = form_ref.current.elements;
        if(!form.signup_username.value) await setUsernameMsg('Please enter username.')
        if(!form.signup_password.value) await setPasswordMsg('Please enter password.')
        if(!form.signup_confirm_password.value) await setConfirmPasswordMsg('Please enter re-enter password.')
        if (!form.signup_street_address.value) await setStreetAddressMsg('Please enter street address.');
        if (!form.signup_city.value) await setCityMsg('Please enter city.');
        if (!form.signup_postal_code.value) await setPostalCodeMsg('Please enter postal code.');
        if (form.signup_state.value === 'none') await setStateMsg('Please select a state.');
        if (form.signup_country.value === 'none') await setCountryMsg('Please select a country.');
        if (!form.signup_username.value || !form.signup_password.value || !form.signup_confirm_password.value || !form.signup_street_address.value || !form.signup_city.value || !form.signup_postal_code.value || form.signup_state.value === 'none' || form.signup_country.value === 'none') return // Done like this to prevent issues with async



        // Check passwords match
        if(!(form.signup_password.value === form.signup_confirm_password.value)) {
            form.signup_password.value = ''
            form.signup_confirm_password.value = ''
            await setServerErrorMsg('Passwords must match.')
            return
        }

        // Address validation
        const is_valid_address = await address_validation(form.signup_street_address.value, form.signup_city.value, form.signup_state.value, form.signup_postal_code.value)
        if(!is_valid_address) {
            setServerErrorMsg('Entered invalid address')
            return
        }

        try {
            const account_type = is_account_type_toggled ? 'owner' : 'consumer'
            const register_body = {
                username: form.signup_username.value,
                password: form.signup_password.value,
                street_address: form.signup_street_address.value,
                city: form.signup_city.value,
                postal_code: form.signup_postal_code.value,
                state: form.signup_state.value,
                country: form.signup_country.value,
            }
            const response  = await fetch(base_url + `/auth/register/` + account_type, {
                method: 'POST',
                body: JSON.stringify(register_body),
                headers: { 'Content-Type': 'application/json' }
            })
            if(response.status === 400) {
                const { err_msg } = await response.json()
                await setServerErrorMsg(err_msg)
            } else {
                await setServerErrorMsg('')
            }
            if(!response.ok) throw new Error(`Failed to register account. Status: ${response.status}`);

            // Success! Direct to Sign in
            setFormStatus(FORM_TYPE.LOG_IN)
        } catch (e) {
            console.error('Error: ', e);
        }
    }
    const handleAccountTypeToggle = (event) => {
        setIsAccountTypeToggled(event.target.checked);
    }

    return (
        <section className="signup">
            <form className="signup_form" ref={form_ref} onSubmit={handleSignUp}>
                <section className="account_type_toggle">
                    <p>Consumer</p>
                    <input id="account_type_toggle_btn" type="checkbox" checked={is_account_type_toggled} onChange={handleAccountTypeToggle} className="toggle" />
                    <p>Business Owner</p>
                </section>
                {
                    server_error_msg && <p className="auth_server_error_msg">{server_error_msg}</p>
                }
                <section className="auth_entries">
                    {/* Username, Password, Re-Enter Password */}
                    <section className="auth_entry">
                        <p className="auth_text">Username:</p>
                        <input type="text" name="signup_username" className="auth_input" placeholder={username_msg} />
                    </section>
                    <section className="auth_password">
                        <section className="auth_entry">
                            <p className="auth_text">Password:</p>
                            <input type="password" name="signup_password" className="auth_input" placeholder={password_msg} />
                        </section>
                        <section className="auth_entry">
                            <p className="auth_text">Confirm Password:</p>
                            <input type="password" name="signup_confirm_password" className="auth_input" placeholder={confirm_password_msg} />
                        </section>
                    </section>
                    {/* Location */}
                    <section className="location_auth_entries">
                        <section className="location_auth_entry">
                            <p className="location_auth_text">Street Address:</p>
                            <input type="text" name="signup_street_address" className="auth_input" placeholder={street_address_msg} />
                        </section>
                        <section className="location_auth_entry">
                            <p className="location_auth_text">City:</p>
                            <input type="text" name="signup_city" className="auth_input" placeholder={city_msg} />
                        </section>
                        <section className="location_auth_entry">
                            <p className="location_auth_text">Postal Code:</p>
                            <input type="text" name="signup_postal_code" className="auth_input" placeholder={postal_code_msg} />
                        </section>
                        <section className="location_auth_entry">
                            <p className="location_auth_text">State:</p>
                            <select name="signup_state" className="auth_input">
                                <option value="none">{state_msg || 'Select a State:'}</option>
                                {states.map((state) => (
                                    <option key={state.abbreviation} value={state.abbreviation}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </section>
                        <section className="location_auth_entry">
                            <p className="location_auth_text">Country:</p>
                            <select name="signup_country" className="auth_input">
                                <option value="none">{country_msg || 'Select a Country:'}</option>
                                <option value="US">United States</option>
                            </select>
                        </section>
                    </section>
                </section>
                <button type="submit" className="auth_submit_btn">{auth_form_title}</button>
            </form>
        </section>
    )
}

SignUpForm.propTypes = {
    auth_form_title: PropTypes.string.isRequired,
    FORM_TYPE: PropTypes.object.isRequired,
    setFormStatus: PropTypes.func.isRequired
}


export default SignUpForm
