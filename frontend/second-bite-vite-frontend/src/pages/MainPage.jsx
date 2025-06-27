import React from 'react'

import PrimaryHeader from '../header/PrimaryHeader';
import ConsumerLocation from '../components/main/LocationSearch/ConsumerLocation';
import Specifiers from '../components/main/FilterSort/Specifiers';
import RestaurantTiles from '../components/main/RestaurantTiles/RestaurantTiles';

const MainPage = () => {
    return (
        <>
            <PrimaryHeader />
            <main>
                <ConsumerLocation />
                <Specifiers />
                <RestaurantTiles />
            </main>
        </>
    );
}


export default MainPage