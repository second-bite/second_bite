import React, { useContext } from "react";
import RestaurantTile from "./RestaurantTile";
import sample_restaurants from "../../misc/SampleRestaurants";
import { AppContext } from "../../../context/AppContext";


const RestaurantTiles = () => {
    const {base_url, restaurants, setRestaurants} = useContext(AppContext)

    // TODO: Initial loading of restaurants
    useContext(() => {
        const initialRestaurantFetch = async () => {
            try{
                const response = await fetch(base_url + '/restaurant', {
                    method: 'GET',
                    credentials: 'include',
                })
                if(!response.ok) throw new Error(`Status: ${response.status}. Failed to initially fetch restaurants`)
                const restaurant_data = await response.json()
            } catch (err) {
                console.error('Error: ', err)
            }
        }
        initialRestaurantFetch()
    })

    return (
        <section className="restaurant_tiles">
            {
                sample_restaurants.map((restaurant) => (
                    <RestaurantTile restaurant={restaurant} />
                ))
            }
        </section>
    )
}


export default RestaurantTiles