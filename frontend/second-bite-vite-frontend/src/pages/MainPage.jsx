import React, {useState} from 'react'

import PrimaryHeader from '../header/PrimaryHeader';
import ConsumerLocation from '../components/main/LocationSearch/ConsumerLocation';
import Specifiers from '../components/main/FilterSort/Specifiers';
import RestaurantTiles from '../components/main/RestaurantTiles/RestaurantTiles';

const MainPage = () => {
    const [search_query, setSearchQuery] = useState('')

    return (
        <>
            <PrimaryHeader />
            <main>
                <ConsumerLocation />
                <Specifiers search_query={search_query} setSearchQuery={setSearchQuery}/>
                <RestaurantTiles />
            </main>
        </>
    );
}


export default MainPage