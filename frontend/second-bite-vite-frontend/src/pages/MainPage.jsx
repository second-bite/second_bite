import React from 'react'

import PrimaryHeader from '../header/PrimaryHeader';
import ConsumerLocation from '../components/main/LocationSearch/ConsumerLocation';
import FilterSort from '../components/main/FilterSort/FilterSort';
import RestaurantTiles from '../components/main/RestaurantTiles/RestaurantTiles';

const MainPage = () => {
    return (
        <>
            <PrimaryHeader />
            <main>
                <ConsumerLocation />
                <FilterSort />
                <RestaurantTiles />
            </main>
        </>
    );
}


export default MainPage