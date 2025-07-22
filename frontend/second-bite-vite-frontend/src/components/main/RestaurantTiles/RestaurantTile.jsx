import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types'
import { AppContext } from "../../../context/AppContext";
import { log_error } from "../../../utils/utils";


const RestaurantTile = ({restaurant: {restaurant_id, name, descr, address, categories, img_url, img_alt, avg_cost, avg_rating, pickup_time, distance_text, distance_value, is_favorited: is_favorited_}, recommended_restaurants, setRecommendedRestaurants}) => {
    const { base_url, setIsRestaurantModal, setSelectedRestaurant, displayed_restaurants, setDisplayedRestaurants } = useContext(AppContext)

    const restaurant_header_style = {
        "background-image": "radial-gradient(circle at center, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.7)), url('https://picsum.photos/200/300')",
        "background-size": "cover",
        "background-position": "center"
    }

    // Retrieving day of the week index (to retrieve correct pickup_time)
    const [day_idx, setDayIdx] = useState(new Date().getDay())
    useEffect(() => {
        // Initial Timeout
        const remainingMSUntilMidnight = () => {
            const now = new Date();
            const next_midnight = new Date();
            next_midnight.setHours(24, 0, 0, 0); // Set to next midnight
            return next_midnight - now;
        }

        const updateDay = () => {
            setDayIdx(new Date().getDay());
        };

        // Set timeout for next midnight
        setTimeout(() => {
            updateDay();
            setInterval(updateDay, 24 * 60 * 60 * 1000); // 24h interval
        }, remainingMSUntilMidnight());

    }, [])

    // Formatting Cost
    const [avg_cost_formatted, setAvgCostFormatted] = useState(0)
    useEffect(() => {
        const usd_formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        })
        const formatted_cost = usd_formatter.format(Number(avg_cost))
        setAvgCostFormatted(formatted_cost)
    }, [avg_cost])

    // Formatting Average Rating
    const [avg_rating_formatted, setAvgRatingFormatted] = useState(0)
    useEffect(() => {
        const formatted_rating = parseFloat(avg_rating).toFixed(2)
        setAvgRatingFormatted(formatted_rating)
    }, [avg_rating])

    // Restaurant Favorited Status
    const [is_favorited, setIsFavorited] = useState(is_favorited_)
    useEffect(() => {
        // Get favorited status initially & maintain internally (to avoid additional API calls)
        setIsFavorited(is_favorited_)
    }, [is_favorited_])

    // Handlers
    const handleRestaurantTileClick = async () => {
        setSelectedRestaurant({restaurant_id, name, descr, address, categories, img_url, img_alt, avg_cost, avg_rating, pickup_time, distance_text, distance_value})
        setIsRestaurantModal(true)
        try {
            const response = await fetch(base_url + '/analytics/visit/' + restaurant_id, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            })
            if(!response.ok) {
                const err = new Error(`Status: ${response.status}. Failed to retrieve owner info from DB`)
                err.status = response.status
                throw err
            }
        } catch (err) {
            log_error(err)
        }
    }
    const handleRestaurantFavorite = async (event) => {
        event.stopPropagation()
        try {
            // Toggle favorited status
            const response = await fetch(`${base_url}/consumer/favorite/${restaurant_id}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            })

            if(!response.ok) {
                const err = new Error(`Status: ${response.status}. Failed to toggle restaurant favorite status`)
                err.status = response.status
                throw err
            }

            const data = await response.json()
            setIsFavorited(data.is_favorited)

            // Ensure this favorite update is reflected for regular & recommended restaurants
            setDisplayedRestaurants(prev_displayed_restaurants => {
                let index_to_update = prev_displayed_restaurants.findIndex(restaurant => restaurant.restaurant_id === restaurant_id)
                const new_displayed_restaurants = [...prev_displayed_restaurants]
                new_displayed_restaurants[index_to_update].is_favorited = data.is_favorited

                return new_displayed_restaurants
            })
            setRecommendedRestaurants(prev_recommended_restaurants => {
                let index_to_update = prev_recommended_restaurants.findIndex(restaurant => restaurant.restaurant_id === restaurant_id)
                const new_recommended_restaurants = [...prev_recommended_restaurants]
                new_recommended_restaurants[index_to_update].is_favorited = data.is_favorited
                
                return new_recommended_restaurants     
            })

        } catch (err) {
            log_error(err)
        }
    }

    return (
        <section className="restaurant_tile" onClick={handleRestaurantTileClick}>
            <section className="restaurant_header" style={restaurant_header_style}>
                <p className="restaurant_favorite" onClick={(event) => handleRestaurantFavorite(event)} style={{color: (is_favorited) ? 'gold': 'gray'}}>★</p>
                <section className="restaurant_rating">
                    <p className="restaurant_rating_star">★</p>
                    <p className="restaurant_rating_no">{(avg_rating_formatted) === -1.00 ? 'N/A' : avg_rating_formatted}</p>
                </section>
            </section>
            <section className="restaurant_tile_separator">{}</section>
            <section className="restaurant_info">
                <section className="core_restaurant_info">
                    <p className="restaurant_info_title">{name}</p>
                    <p>{`Pick up today: ` + pickup_time[day_idx]} | {distance_text ? distance_text: '??.??mi'}</p>
                </section>
                <section className="restaurant_info_cost">
                    <p>{avg_cost_formatted}</p>
                </section>
            </section>
        </section>
    )
}

RestaurantTile.propTypes = {
  restaurant: PropTypes.shape({
    name:        PropTypes.string.isRequired,
    descr:       PropTypes.string.isRequired,
    address:     PropTypes.shape({
      street_address:      PropTypes.string.isRequired,
      city:        PropTypes.string.isRequired,
      state:       PropTypes.string.isRequired,
      postal_code: PropTypes.string.isRequired,
      country:     PropTypes.string.isRequired,
    }).isRequired,
    categories:  PropTypes.arrayOf(PropTypes.string),
    img_url:     PropTypes.string.isRequired,
    img_alt:     PropTypes.string.isRequired,
    avg_cost:    PropTypes.number.isRequired,
    avg_rating:  PropTypes.number.isRequired,
    pickup_time: PropTypes.arrayOf(PropTypes.string).isRequired,
    distance_text:  PropTypes.string,
    distance_value: PropTypes.number,
    is_favorited_: PropTypes.bool,
  }).isRequired,
  setRecommendedRestaurants: PropTypes.func,
};


export default RestaurantTile