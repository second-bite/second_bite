import React from 'react'

import PrimaryHeader from '../header/PrimaryHeader';
import AccountInfo from '../components/account_info/AccountInfo';

const AccountInfoPage = () => {
    return (
        <>
            <PrimaryHeader />
            <main>
                <AccountInfo />
            </main>
        </>
    );
}


export default AccountInfoPage