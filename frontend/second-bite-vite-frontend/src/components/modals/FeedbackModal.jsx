import React, { useRef, useContext, useState } from "react"
import { AppContext } from "../../context/AppContext"
import Stars from "./Stars"


const FeedbackModal = () => {
    const form_ref = useRef();
    const [num_stars, setNumStars] = useState(0)

    const {is_feedback_modal, setIsFeedbackModal} = useContext(AppContext)

    // Handlers
    const handleFeedbackSubmit = (event) => {
        event.preventDefault()

        // Ensure at least one star has been selected
        if(num_stars === 0) {
            alert("Please enter at least a star rating to leave a review")
            return
        }
        // TODO: 
        handleFeedbackClose()
    }
    const handleFeedbackClose = () => {
        setIsFeedbackModal(false)
        form_ref.current.elements.feedback_text.value = ''
    }
    const handleFeedbackClickoff = (event) => {
        if(event.target === event.currentTarget) handleFeedbackClose();
    }

    return (
        <section className="modal_custom" style={{display: is_feedback_modal ? "block" : "none"}} onClick={handleFeedbackClickoff}>
            <section className="modal_content" id="feedback_modal">
                <form className="feedback_form" ref={form_ref} onSubmit={handleFeedbackSubmit}>
                    <button type="button" className="close_btn" onClick={handleFeedbackClose}>×</button>
                    <h2 className="text-2xl font-bold mt-6 mb-4">We value your opinion.</h2>
                    <p>How would you rate your overall experience?</p>
                    <Stars is_stars_displayed={is_feedback_modal} setNumStars={setNumStars}/>
                    <p>Kindly take a moment to tell us what you think.</p>
                    <textarea type="text" name="feedback_text" className="feedback_text"/>
                    <button type="submit" className="feedback_submit_btn">Share my feedback</button>
                </form>
            </section>
        </section>
    )
}


export default FeedbackModal