import React, { useRef, useContext, useState, useEffect } from "react"
import { AppContext } from "../../context/AppContext"
import { log_error } from "../../utils/utils"


const RestaurantModal = () => {
    const form_ref = useRef()
    const {base_url, selected_restaurant, is_restaurant_modal, setIsRestaurantModal, setIsRatingModal} = useContext(AppContext)

    const [is_reserved, setIsReserved] = useState(false)

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

    // Check if restaurant has been reserved
    useEffect(() => {
        const fetchIsRestaurantReserved = async () => {
            try {
              const response = await fetch(base_url + '/consumer', {
                  method: 'GET',
                  credentials: 'include',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              })
              const err = new Error(`Status: ${response.status}. Failed to fetch logged in consumer's info`)
              err.status = response.status
              if(!response.ok) throw err
              const data = await response.json()

              if(data.reservation_expiration && (((new Date()) < (new Date(data.reservation_expiration)))) && (data.reserved_restaurant_id === selected_restaurant.restaurant_id)) setIsReserved(true)
              else setIsReserved(false)
            } catch (err) {
                await log_error(err)
            }
        }

        fetchIsRestaurantReserved()
    }, [is_restaurant_modal])

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
    const handleReserveRestaurant = async () => {
        try {
            const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone
            const response = await fetch(base_url + '/consumer/reserve/' + selected_restaurant.restaurant_id + '/' + encodeURIComponent(time_zone), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })

            // Restaurant is either closed or is past pickup/closing time for the day
            if(response.status === 409 ) {
                const data = await response.json()
                alert(data.message)
                return
            }
            else if(!response.ok) {
                alert('Failed to reserve restaurant due to server error:(')
                const err = new Error(`Failed to reserve restaurant. Status: ${response.status}`)
                err.status = response.status
                throw err
            }

            // Reservation succeeded!
            setIsReserved(true)
        } catch (err) {
            log_error(err)
        }
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
                            <button type="button" className="reserve_restaurant_btn" style={(is_reserved) ? {backgroundColor: `steelblue`, color: `white`} : {backgroundColor: `lightgray`, color: `black`}} onClick={handleReserveRestaurant}>{is_reserved ? "Restaurant is Reserved" : "Reserve Order"}</button>
                        </section>
                    </section>
                </form>
            </section>
        </section>
    )
}


export default RestaurantModal