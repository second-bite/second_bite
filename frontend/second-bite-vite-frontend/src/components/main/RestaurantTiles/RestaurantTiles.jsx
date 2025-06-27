import React from "react";
import RestaurantTile from "./RestaurantTile";
import sample_restaurants from "../../misc/SampleRestaurants";


const RestaurantTiles = () => {
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