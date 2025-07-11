import React, { useRef, useContext, useState, useEffect } from "react"
import { AppContext } from "../../context/AppContext"
import Stars from "./Stars"


const RatingModal = () => {
    const form_ref = useRef();
    const {base_url, selected_restaurant, is_rating_modal, setIsRatingModal} = useContext(AppContext)
    const [num_stars, setNumStars] = useState(0)

    // Handlers
    const handleClose = () => {
        setIsRatingModal(false)
        form_ref.current.elements.rating_text.value = ''
    }
    const handleClickoff = (event) => {
        if(event.target === event.currentTarget) handleClose();
    }
    const handleRatingSubmit = async (event) => {
        event.preventDefault()

        // Ensure at least one star has been selected
        if(num_stars === 0) {
            alert("Please enter at least a star rating to leave a review")
            return
        }
        
        const rating_body = {
            num_stars: num_stars,
        };
        (form_ref.current.elements.rating_text.value) ? (rating_body.msg = form_ref.current.elements.rating_text.value) : null

        // TODO: get restaurant id
        const response = await fetch(base_url + '/restaurant/rating/' + selected_restaurant.restaurant_id, {
            method: 'POST',
            body: JSON.stringify(rating_body),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })

        if(response.status === 403) {
            alert("You've already left a review. You're limited to one review per restaurant.")
            return
        }

        const err = new Error(`Failed to add review. Status: ${response.status}`)
        err.status = response.status
        if(!response.ok) throw err
        handleClose()
    }

    return(
        <section className="modal_star_custom" style={{display: is_rating_modal ? "block" : "none"}} onClick={handleClickoff}>
            <section className="modal_content" id="rating_modal">
                <form className="feedback_form" ref={form_ref} onSubmit={(e) => handleRatingSubmit(e)}>
                    <button type="button" className="close_btn" onClick={handleClose}>×</button>
                    <h2 className="text-2xl font-bold mt-6 mb-4">Please rate the restaurant.</h2>
                    <p>How would you rate your overall experience?</p>
                    <Stars is_stars_displayed={is_rating_modal} setNumStars={setNumStars}/>
                    <p>Kindly take a moment to tell them what you think.</p>
                    <textarea type="text" name="rating_text" className="rating_text"/>
                    <button type="submit" className="rating_submit_btn">Share my rating</button>
                </form>
            </section>
        </section>
    )
}


export default RatingModal