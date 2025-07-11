import React, { useRef, useContext, useState, useEffect } from "react"
import { AppContext } from "../../context/AppContext"


const RestaurantModal = () => {
    const form_ref = useRef()
    const {selected_restaurant, is_restaurant_modal, setIsRestaurantModal, setIsRatingModal} = useContext(AppContext)

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
        const formatted_cost = usd_formatter.format(Number(selected_restaurant.avg_cost))
        setAvgCostFormatted(formatted_cost)
    }, [selected_restaurant.avg_cost])

    // Handlers
    const handleRestaurantClickoff = (event) => {
        if(event.target === event.currentTarget) handleClose();
    }
    const handleClose = () => {
        setIsRestaurantModal(false)
    }
    const handleAddRating = () => {
        setIsRatingModal(true)
    }
    const handleReserveRestaurant = () => {

    }

    return(
        <section className="modal_custom" style={{display: is_restaurant_modal ? "block" : "none"}} onClick={handleRestaurantClickoff}>
            <section className="modal_content" id="restaurant_modal">
                <form className="restaurant_form" ref={form_ref}>
                    <button type="button" className="close_btn" onClick={handleClose}>×</button>
                    <h2 className="text-2xl font-bold mt-6 mb-4">{selected_restaurant.name}</h2>
                    <section className="restaurant_modal_info">
                        <p><span style={{ fontWeight: 550 }}>Description</span>: {selected_restaurant.descr}</p>
                        <p><span style={{ fontWeight: 550 }}>Address</span>: {selected_restaurant.address?.street_address}, {selected_restaurant.address?.city}, {selected_restaurant.address?.state} {selected_restaurant.address?.postal_code}, {selected_restaurant.address?.country}</p>
                        <p><span style={{ fontWeight: 550 }}>Categories</span>: {selected_restaurant.categories?.join(', ')}</p>
                        <p><span style={{ fontWeight: 550 }}>Avg. Cost</span>: {avg_cost_formatted} | 
                            <span style={{ fontWeight: 550 }}> Avg. Rating</span>: {(selected_restaurant.avg_rating) === -1 ? 'N/A' : selected_restaurant.avg_rating} | 
                            <span style={{ fontWeight: 550 }}> Distance</span>: {selected_restaurant.distance_text ? selected_restaurant.distance_text: '??.??mi'} | 
                            <span style={{ fontWeight: 550 }}> Pickup Time</span>: {Array.isArray(selected_restaurant.pickup_time) ? selected_restaurant.pickup_time[day_idx] : 'N/A'}</p>
                        <section className="restaurant_modal_btns">
                            <button type="button" className="add_rating_btn" onClick={handleAddRating}>Add Rating</button>
                            <button type="button" className="reserve_restaurant_btn" onClick={handleReserveRestaurant}>Reserve Order</button>
                        </section>
                    </section>
                </form>
            </section>
        </section>
    )
}


export default RestaurantModal