import React, {useState, useRef} from 'react'
import PropTypes from 'prop-types'
import states from '../misc/States'

const SignUpForm = ({auth_form_title}) => {
    const form_ref = useRef()

    // Required Field Error Msgs
    const [username_msg, setUsernameMsg] = useState('')
    const [password_msg, setPasswordMsg] = useState('')
    const [confirm_password_msg, setConfirmPasswordMsg] = useState('')
    const [street_no_msg, setStreetNoMsg] = useState('');
    const [street_name_msg, setStreetNameMsg] = useState('');
    const [city_msg, setCityMsg] = useState('');
    const [state_msg, setStateMsg] = useState('');
    const [country_msg, setCountryMsg] = useState('');
    
    const handleSignUp = async (event) => {
        event.preventDefault()

        if(!form_ref.current.elements.signup_username.value) await setUsernameMsg('Please enter username.')
        if(!form_ref.current.elements.signup_password.value) await setPasswordMsg('Please enter password.')
        if(!form_ref.current.elements.signup_confirm_password.value) await setConfirmPasswordMsg('Please enter re-enter password.')
        if (!form_ref.current.elements.signup_street_no.value) await setStreetNoMsg('Please enter street number.');
        if (!form_ref.current.elements.signup_street_name.value) await setStreetNameMsg('Please enter street name.');
        if (!form_ref.current.elements.signup_city.value) await setCityMsg('Please enter city.');
        if (form_ref.current.elements.signup_state.value === 'none') await setStateMsg('Please select a state.');
        if (form_ref.current.elements.signup_country.value === 'none') await setCountryMsg('Please select a country.');
        if(username_msg || password_msg || confirm_password_msg || street_no_msg || street_name_msg || city_msg || state_msg || country_msg) return;
    }

    return (
        <section className="signup">
            <form className="signup_form" ref={form_ref} onSubmit={handleSignUp}>
                <section className="auth_entries">
                    {/* Username, Password, Re-Enter Password */}
                    <section className="auth_entry">
                        <p className="auth_text">Username:</p>
                        <input type="text" name="signup_username" className="auth_input" placeholder={username_msg} />
                    </section>
                    <section className="auth_password">
                        <section className="auth_entry">
                            <p className="auth_text">Password:</p>
                            <input type="text" name="signup_password" className="auth_input" placeholder={password_msg} />
                        </section>
                        <section className="auth_entry">
                            <p className="auth_text">Confirm Password:</p>
                            <input type="text" name="signup_confirm_password" className="auth_input" placeholder={confirm_password_msg} />
                        </section>
                    </section>
                    {/* Location */}
                    <section className="location_auth_entries">
                        <section className="location_auth_entry">
                            <p className="location_auth_text">Street No.:</p>
                            <input type="text" name="signup_street_no" className="auth_input" placeholder={street_no_msg} />
                        </section>
                        <section className="location_auth_entry">
                            <p className="location_auth_text">Street Name:</p>
                            <input type="text" name="signup_street_name" className="auth_input" placeholder={street_name_msg} />
                        </section>
                        <section className="location_auth_entry">
                            <p className="location_auth_text">City:</p>
                            <input type="text" name="signup_city" className="auth_input" placeholder={city_msg} />
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
                        <section className="location_auth_entry" id="location_auth_country">
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
    auth_form_title: PropTypes.string.isRequired
}


export default SignUpForm
