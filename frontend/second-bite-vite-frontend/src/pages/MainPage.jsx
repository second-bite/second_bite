import React, {useState} from 'react'

import PrimaryHeader from '../header/PrimaryHeader';
import Search from '../components/main/Search/Search';
import Specifiers from '../components/main/FilterSort/Specifiers';
import RestaurantTiles from '../components/main/RestaurantTiles/RestaurantTiles';

const MainPage = () => {
    const [restaurant_search_query, setRestaurantSearchQuery] = useState('')

    return (
        <>
            <PrimaryHeader />
            <main>
                <Search setRestaurantSearchQuery={setRestaurantSearchQuery}/>
                <Specifiers restaurant_search_query={restaurant_search_query} />
                <RestaurantTiles />
            </main>
        </>
    );
}


export default MainPage