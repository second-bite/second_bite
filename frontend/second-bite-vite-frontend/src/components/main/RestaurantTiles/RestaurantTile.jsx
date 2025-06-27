import React from "react";
import PropTypes from 'prop-types'


const RestaurantTile = ({restaurant: {}}) => {
    const restaurant_header_style = {
        "background-image": "radial-gradient(circle at center, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.7)), url('https://picsum.photos/200/300')",
        "background-size": "cover",
        "background-position": "center"
    }

    return (
        <section className="restaurant_tile">
            <section className="restaurant_header" style={restaurant_header_style}>
                <p className="restaurant_favorite">★</p>
                <section className="restaurant_rating">
                    <p className="restaurant_rating_star">★</p>
                    <p className="restaurant_rating_no">4.7</p>
                </section>
            </section>
            <section className="restaurant_tile_separator">{}</section>
            <section className="restaurant_info">
                <section className="core_restaurant_info">
                    <p className="restaurant_info_title">Restaurant Name</p>
                    <p>Pick up today: XX:XXPM | 3.6mi</p>
                </section>
                <section className="restaurant_info_cost">
                    <p>$$$</p>
                </section>
            </section>
        </section>
    )
}

RestaurantTile.propTypes = {

}

export default RestaurantTile