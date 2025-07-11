import React, { useContext, useEffect } from "react";
import RestaurantTile from "./RestaurantTile";
import sample_restaurants from "../../misc/SampleRestaurants";
import { AppContext } from "../../../context/AppContext";
import { log_error } from "../../../utils/utils";


const RestaurantTiles = () => {
    const {base_url, setRestaurants, displayed_restaurants, setDisplayedRestaurants} = useContext(AppContext)

    useEffect(() => {
        const initialRestaurantFetch = async () => {
            try{
                const response = await fetch(base_url + '/restaurant', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const err = new Error(`Status: ${response.status}. Failed to initially fetch restaurants`)
                err.status = response.status
                if(!response.ok) throw err
                const restaurant_data = await response.json()
                setRestaurants(restaurant_data)
                setDisplayedRestaurants(restaurant_data)
            } catch (err) {
                await log_error(err)
            }
        }
        initialRestaurantFetch()
    }, [])

    return (
        <section className="restaurant_tiles">
            {
                displayed_restaurants.map((restaurant) => (
                    <RestaurantTile restaurant={restaurant} />
                ))
            }
        </section>
    )
}


export default RestaurantTiles