import React, { useContext, useEffect, useState } from "react"
import RestaurantTile from "./RestaurantTile"
import { AppContext } from "../../../context/AppContext"
import { log_error } from "../../../utils/utils"
import { FadeLoader } from 'react-spinners'


const RestaurantTiles = () => {
    const {base_url, recommendation_url, setRestaurants, displayed_restaurants, setDisplayedRestaurants, searched_address, is_recommended_visible} = useContext(AppContext)
    const [recommended_restaurants, setRecommendedRestaurants] = useState([])
    const [is_recommended_loading, setIsRecommendedLoading] = useState(false) // Used for visual polish while loading in recommended restaurants
    const [is_initial_loading, setIsInitialLoading] = useState(false) // Used for visual polish while loading in restaurants initially

    // Get all restaurants
    useEffect(() => {
        const initialRestaurantFetch = async () => {
            try{
                setIsInitialLoading(true)
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
            finally {
                setIsInitialLoading(false)
            }
        }
        initialRestaurantFetch()
    }, [])

    // Get recommended restaurants
    useEffect(() => {
        const recommendedRestaurantFetch = async () => {
            try {
                // Retrieve consumer_id first
                setIsRecommendedLoading(true)
                const consumer_response = await fetch(base_url + `/consumer`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })                
                if(!consumer_response.ok) {
                    const err = new Error(`Status: ${response.status}. Failed to fetch consumer information (specifically needed to retrieve consumer ID)`)
                    err.status = response.status
                    throw err
                }
                const {consumer_id} = await consumer_response.json()

                // Retrieve recommended restaurants
                let address_query = ''
                if(searched_address.street_address) { // Non-empty searched address
                    address_query = `?street_address=${encodeURIComponent(searched_address.street_address)}&city=${encodeURIComponent(searched_address.city)}&postal_code=${encodeURIComponent(searched_address.postal_code)}&state=${encodeURIComponent(searched_address.state)}&country=${encodeURIComponent(searched_address.country)}`
                }
                // Due to vite.config.js, request gets proxied to recommendation_url (needed to transmit cookie for recommendation API calls)
                const response = await fetch(`/recommend/${consumer_id}` + address_query, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if(!response.ok) {
                    const err = new Error(`Status: ${response.status}. Failed to fetch recommended restaurants`)
                    err.status = response.status
                    throw err
                }
                const recommended_restaurant_data = await response.json()
                setRecommendedRestaurants(recommended_restaurant_data)
            } catch (err) {
                await log_error(err)
            }
            finally {
                setIsRecommendedLoading(false)
            }
        }
        if (is_recommended_visible) {
            recommendedRestaurantFetch()
        }
    }, [searched_address, is_recommended_visible])

    return (
        <>
            {is_recommended_visible ? <h3 className="text-xl font-medium tracking-tight text-gray-80 ml-[1.5vw]">Recommended Restaurants</h3> : null}
            {is_recommended_loading ?
                (
                    <section className="loading ml-[1.5vw]">
                        <FadeLoader />
                    </section>
                ) 
                :
                (is_recommended_visible ? 
                    <section className="recommended_restaurant_titles">
                        {
                            recommended_restaurants.map((restaurant) => (
                                <RestaurantTile restaurant={restaurant} recommended_restaurants={recommended_restaurants} setRecommendedRestaurants={setRecommendedRestaurants}/>
                            ))
                        }
                    </section>
                    : null
                )
            }
            <h3 className="text-xl font-medium tracking-tight text-gray-80 ml-[1.5vw]">Browse Restaurants</h3>
            <section className="restaurant_tiles">
                {is_initial_loading ?
                    (
                        <section className="loading">
                            <FadeLoader />
                        </section>
                    ) 
                    :
                    (
                        displayed_restaurants.map((restaurant) => (
                            <RestaurantTile restaurant={restaurant} recommended_restaurants={recommended_restaurants} setRecommendedRestaurants={setRecommendedRestaurants}/>
                        ))
                    )
                }
            </section>
        </>
    )
}


export default RestaurantTiles