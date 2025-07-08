import React from 'react'

import PrimaryHeader from '../header/PrimaryHeader';
import OwnerInfo from '../components/account_info/OwnerInfo';

const OwnerInfoPage = () => {
    return (
        <>
            <PrimaryHeader />
            <main>
                <OwnerInfo />
            </main>
        </>
    );
}


export default OwnerInfoPage