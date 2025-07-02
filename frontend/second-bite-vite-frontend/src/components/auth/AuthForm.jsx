import React, {useState, useEffect} from 'react'
import SignUpForm from './SignUpForm'
import LoginForm from './LoginForm'

const AuthForm = () => {
    const [auth_form_title, setAuthFormTitle] = useState(`Sign Up`)
    const form_enum = {
        SIGN_UP: 'sign_up',
        LOG_IN: 'log_in',
    }
    const [form_status, setFormStatus] = useState(form_enum.SIGN_UP)

    useEffect(() => {
        if(form_status === form_enum.SIGN_UP) setAuthFormTitle('Sign Up')
        else if(form_status === form_enum.LOG_IN) setAuthFormTitle('Log In')
    }, [form_status])

    const handleSignUpToggle = () => {
        if(!(form_status === form_enum.SIGN_UP)) setFormStatus(form_enum.SIGN_UP)
    }
    const handleLogInToggle = () => {
        if(!(form_status === form_enum.LOG_IN)) setFormStatus(form_enum.LOG_IN)
    }
    const signup_auth_btn_style = {
        "color": (form_status === form_enum.SIGN_UP) ? "white" : "black",
        "background-color":  (form_status === form_enum.SIGN_UP) ? "black" : "transparent"
    }

    const login_auth_btn_style = {
        "color": (form_status === form_enum.LOG_IN) ?  "white" : "black",
        "background-color": (form_status === form_enum.LOG_IN) ?  "black" : "transparent"       
    }

    return (
        <section className="auth">
            <section className="auth_container">
                <h2 className="text-2xl font-bold mt-6 mb-4" id="auth_h2">{auth_form_title}</h2>
                <section className="auth_toggle_btns">
                    <button style={signup_auth_btn_style} id="signup_auth_btn" className="auth_toggle_btn" onClick={handleSignUpToggle}>Sign Up</button>
                    <button style={login_auth_btn_style} id="login_auth_btn" className="auth_toggle_btn" onClick={handleLogInToggle}>Log In</button>
                </section>
                {(form_status === form_enum.SIGN_UP) ? <SignUpForm auth_form_title={auth_form_title} form_enum={form_enum} setFormStatus={setFormStatus}/> : <LoginForm auth_form_title={auth_form_title}/>}
            </section>
        </section>
    )
}


export default AuthForm