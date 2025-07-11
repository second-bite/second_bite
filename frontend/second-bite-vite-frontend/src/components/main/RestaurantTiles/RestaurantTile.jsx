import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types'


const RestaurantTile = ({restaurant: {name, descr, address, categories, img_url, img_alt, avg_cost, avg_rating, pickup_time, distance_text, distance_value}}) => {
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

    return (
        <section className="restaurant_tile">
            <section className="restaurant_header" style={restaurant_header_style}>
                <p className="restaurant_favorite">★</p>
                <section className="restaurant_rating">
                    <p className="restaurant_rating_star">★</p>
                    <p className="restaurant_rating_no">{(avg_rating) === -1 ? 'N/A' : avg_rating}</p>
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
  }).isRequired,
};


export default RestaurantTile