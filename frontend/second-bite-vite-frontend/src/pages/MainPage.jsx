import React, {useState} from 'react'

import PrimaryHeader from '../header/PrimaryHeader';
import ConsumerLocation from '../components/main/LocationSearch/ConsumerLocation';
import Specifiers from '../components/main/FilterSort/Specifiers';
import RestaurantTiles from '../components/main/RestaurantTiles/RestaurantTiles';

const MainPage = () => {
    const [search_query, setSearchQuery] = useState('')
    const [searched_address, setSearchedAddress] = useState({})

    return (
        <>
            <PrimaryHeader />
            <main>
                <ConsumerLocation setSearchedAddress={setSearchedAddress}/>
                <Specifiers search_query={search_query} setSearchQuery={setSearchQuery} searched_address={searched_address}/>
                <RestaurantTiles />
            </main>
        </>
    );
}


export default MainPage