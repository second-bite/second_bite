import React, {useState, useRef} from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({auth_form_title}) => {
    const form_ref = useRef()
    const [username_msg, setUsernameMsg] = useState('')
    const [password_msg, setPasswordMsg] = useState('')

    const handleLogIn = async (event) => {
        event.preventDefault()

        if(!form_ref.current.elements.login_username.value) await setUsernameMsg('Please enter username.')
        if(!form_ref.current.elements.login_password.value) await setPasswordMsg('Please enter password.')
        if(username_msg || password_msg) return;
    }

    return (
        <section className="login">
            <form className="login_form" ref={form_ref} onSubmit={handleLogIn}>
                <section className="auth_entries">
                    <section className="auth_entry">
                        <p className="auth_text">Username:</p>
                        <input type="text" name="login_username" className="auth_input" placeholder={username_msg} />
                    </section>
                    <section className="auth_entry">
                        <p className="auth_text">Password:</p>
                        <input type="text" name="login_password" className="auth_input" placeholder={password_msg} />
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
