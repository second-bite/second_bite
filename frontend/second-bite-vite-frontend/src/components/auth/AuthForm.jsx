import React, {useState, useEffect} from 'react'
import SignUpForm from './SignUpForm'
import LoginForm from './LoginForm'

const AuthForm = () => {
    const [auth_form_title, setAuthFormTitle] = useState(`Sign Up`)
    const form_enum = {
        sign_up: 'sign_up',
        log_in: 'log_in',
    }
    const [form_status, setFormStatus] = useState(form_enum.sign_up)

    useEffect(() => {
        if(form_status === form_enum.sign_up) setAuthFormTitle('Sign Up')
        else if(form_status === form_enum.log_in) setAuthFormTitle('Log In')
    }, [form_status])

    const handleSignUpToggle = () => {
        if(!(form_status === form_enum.sign_up)) setFormStatus(form_enum.sign_up)
    }
    const handleLogInToggle = () => {
        if(!(form_status === form_enum.log_in)) setFormStatus(form_enum.log_in)
    }
    const signup_auth_btn_style = {
        "color": (form_status === form_enum.sign_up) ? "white" : "black",
        "background-color":  (form_status === form_enum.sign_up) ? "black" : "transparent"
    }

    const login_auth_btn_style = {
        "color": (form_status === form_enum.log_in) ?  "white" : "black",
        "background-color": (form_status === form_enum.log_in) ?  "black" : "transparent"       
    }

    return (
        <section className="auth">
            <section className="auth_container">
                <h2 className="text-2xl font-bold mt-6 mb-4" id="auth_h2">{auth_form_title}</h2>
                <section className="auth_toggle_btns">
                    <button style={signup_auth_btn_style} id="signup_auth_btn" className="auth_toggle_btn" onClick={handleSignUpToggle}>Sign Up</button>
                    <button style={login_auth_btn_style} id="login_auth_btn" className="auth_toggle_btn" onClick={handleLogInToggle}>Log In</button>
                </section>
                {(form_status === form_enum.sign_up) ? <SignUpForm auth_form_title={auth_form_title} form_enum={form_enum} setFormStatus={setFormStatus}/> : <LoginForm auth_form_title={auth_form_title}/>}
            </section>
        </section>
    )
}


export default AuthForm