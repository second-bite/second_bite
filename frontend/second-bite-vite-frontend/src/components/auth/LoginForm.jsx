import React, {useState, useRef, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'

import { useNavigate } from 'react-router'

import { log_error } from '../../utils/utils'
import { AppContext } from '../../context/AppContext'
import { AuthContext } from '../../context/AuthContext'

const LoginForm = ({auth_form_title}) => {
    const form_ref = useRef()
    const navigate = useNavigate()

    const {base_url} = useContext(AppContext)
    const {setIsLoading, auth_status, setAuthStatus, AUTH_STATUS} = useContext(AuthContext)

    // State Vars
    const [is_account_type_toggled, setIsAccountTypeToggled] = useState(false)
    const [server_error_msg, setServerErrorMsg] = useState('')

    // Required Field Error Msgs
    const [username_msg, setUsernameMsg] = useState('')
    const [password_msg, setPasswordMsg] = useState('')

    useEffect(() => {
        if (auth_status === AUTH_STATUS.CONSUMER_AUTH) {
            navigate('/main');
        }
        else if (auth_status === AUTH_STATUS.OWNER_AUTH) {
            navigate('/analytics');
        }
    }, [auth_status]);

    const handleLogIn = async (event) => {
        event.preventDefault()
        await setIsLoading(true)

        // Ensure all required fields are filled
        const form = form_ref.current.elements
        if(!form.login_username.value) await setUsernameMsg('Please enter username.')
        if(!form.login_password.value) await setPasswordMsg('Please enter password.')
        if(!form.login_username.value || !form.login_password.value) return; // Done like this to prevent issues with async

        try {
            const login_body = {
                username: form.login_username.value,
                password: form.login_password.value,
            }
            const account_type = is_account_type_toggled ? 'owner' : 'consumer'
            const response  = await fetch(base_url + `/auth/login/` + account_type, {
                method: 'POST',
                body: JSON.stringify(login_body),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })
            if(response.status === 400 || response.status === 401) {
                const err_msg = await response.json().message
                await setServerErrorMsg(`Error Status: ${response.status}. Error: ${err_msg}`)
            } else {
                await setServerErrorMsg('')
            }
            const err = new Error(`Failed to log into account. Status: ${response.status}`)
            err.status = response.status
            if(!response.ok) throw err

            // Sucess! Direct to main page (with useEffect)
            await setAuthStatus(is_account_type_toggled ? AUTH_STATUS.OWNER_AUTH : AUTH_STATUS.CONSUMER_AUTH)
        } catch (err) {
            await log_error(err)
        } finally {
            await setIsLoading(false)
        }
    }
    const handleAccountTypeToggle = (event) => {
        setIsAccountTypeToggled(event.target.checked);
    }
    

    return (
        <section className="login">
            <form className="login_form" ref={form_ref} onSubmit={handleLogIn}>
                <section className="account_type_toggle">
                    <p>Consumer</p>
                    <input id="account_type_toggle_btn" type="checkbox" checked={is_account_type_toggled} onChange={handleAccountTypeToggle} className="toggle" />
                    <p>Business Owner</p>
                </section>
                {
                    server_error_msg && <p className="auth_server_error_msg">{server_error_msg}</p>
                }
                <section className="auth_entries">
                    <section className="auth_entry">
                        <p className="auth_text">Username:</p>
                        <input type="text" name="login_username" className="auth_input" placeholder={username_msg} />
                    </section>
                    <section className="auth_entry">
                        <p className="auth_text">Password:</p>
                        <input type="password" name="login_password" className="auth_input" placeholder={password_msg} />
                    </section>
                </section>
                <button type="submit" className="auth_submit_btn">{auth_form_title}</button>
            </form>
        </section>
    )
}

LoginForm.propTypes = {
    auth_form_title: PropTypes.string.isRequired
}


export default LoginForm
