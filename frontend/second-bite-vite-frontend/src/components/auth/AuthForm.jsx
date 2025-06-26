import React, {useState, useEffect} from 'react'
import SignUpForm from './SignUpForm'
import LoginForm from './LoginForm'

const AuthForm = () => {
    const [auth_form_title, setAuthFormTitle] = useState(`Sign Up`)
    const [is_signup, setIsSignUp] = useState(true);

    // TODO: useEffect auth_form_title based on is_sign_up
    useEffect(() => {
        if(is_signup) setAuthFormTitle('Sign Up')
        else setAuthFormTitle('Log In')
    }, [is_signup])

    const handleSignUpToggle = () => {
        if(!is_signup) setIsSignUp(true);
    }
    const handleLogInToggle = () => {
        if(is_signup) setIsSignUp(false);
    }
    const signup_auth_btn_style = {
        "color": (is_signup) ? "white" : "black",
        "background-color": (is_signup) ? "black" : "transparent"
    }

    const login_auth_btn_style = {
        "color": (is_signup) ? "black" : "white",
        "background-color": (is_signup) ? "transparent" : "black"        
    }

    return (
        <section className="auth">
            <section className="auth_container">
                <h2 className="auth_h2">{auth_form_title}</h2>
                <section className="auth_toggle_btns">
                    <button style={signup_auth_btn_style} id="signup_auth_btn" className="auth_toggle_btn" onClick={handleSignUpToggle}>Sign Up</button>
                    <button style={login_auth_btn_style} id="login_auth_btn" className="auth_toggle_btn" onClick={handleLogInToggle}>Log In</button>
                </section>
                {is_signup ? <SignUpForm auth_form_title={auth_form_title}/> : <LoginForm auth_form_title={auth_form_title}/>}
            </section>
        </section>
    )
}

export default AuthForm