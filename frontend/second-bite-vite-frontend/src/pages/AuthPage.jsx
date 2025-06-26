import React from 'react'

import AuthHeader from '../header/AuthHeader';
import AuthForm from '../components/auth/AuthForm';

const AuthPage = () => {
    return (
        <>
            <AuthHeader />
            <main>
                <AuthForm />
            </main>
        </>
    );
}


export default AuthPage