import React, { useRef, useContext, useState } from "react"

import { AppContext } from "../../App"


const FeedbackModal = () => {
    // TODO: Make at least submitting some stars/feedback mandatory 
    const form_ref = useRef();
    const [feedback_stars_color, setFeedbackStarsColor] = useState(['gray', 'gray', 'gray', 'gray', 'gray'])

    const {is_feedback_modal, setIsFeedbackModal} = useContext(AppContext)

    const handleFeedbackSubmit = (event) => {
        // Ensure at least one star has been selected
        if(feedback_stars_color[0] === 'gray') {
            alert("Please enter at least a star rating to leave a review")
            return
        }
        // TODO: 
        handleFeedbackClose()
    }
    const handleFeedbackClose = () => {
        setIsFeedbackModal(false)
        form_ref.current.elements.feedback_text.value = ''
        for (let i = 0; i < feedback_stars_color.length; i++) {
            setFeedbackStarsColor((prev_feedback_stars_color) => (
                prev_feedback_stars_color.map(() => 'gray')
            ))
        }
    }
    const handleFeedbackClickoff = (event) => {
        if(event.target === event.currentTarget) handleFeedbackClose();
    }
    const toggleFeedbackStar = (star_num) => {
        if(feedback_stars_color[star_num] === 'gray') { // 
            setFeedbackStarsColor((prev_feedback_stars_color) => (
                prev_feedback_stars_color.map((_, ind) => (ind <= star_num) ?  'gold' : 'gray')
            ))
        }
    }

    return (
        <section className="modal" style={{display: is_feedback_modal ? "block" : "none"}} onClick={handleFeedbackClickoff}>
            <section className="modal_content" id="feedback_modal">
                <form className="feedback_form" ref={form_ref} onSubmit={handleFeedbackSubmit}>
                    <button type="button" className="close_feedback_btn" onClick={handleFeedbackClose}>×</button>
                    <h2>We value your opinion.</h2>
                    <p>How would you rate your overall experience?</p>
                    <section className="feedback_stars">
                        <p className="feedback_star" name="feedback_star1" onClick={() => toggleFeedbackStar(0)} style={{color: feedback_stars_color[0]}}>★</p>
                        <p className="feedback_star" name="feedback_star2" onClick={() => toggleFeedbackStar(1)} style={{color: feedback_stars_color[1]}}>★</p>
                        <p className="feedback_star" name="feedback_star3" onClick={() => toggleFeedbackStar(2)} style={{color: feedback_stars_color[2]}}>★</p>
                        <p className="feedback_star" name="feedback_star4" onClick={() => toggleFeedbackStar(3)} style={{color: feedback_stars_color[3]}}>★</p>
                        <p className="feedback_star" name="feedback_star5" onClick={() => toggleFeedbackStar(4)} style={{color: feedback_stars_color[4]}}>★</p>
                    </section>
                    <p>Kindly take a moment to tell us what you think.</p>
                    <input type="text" name="feedback_text" className="feedback_text"/>
                    <button type="submit" className="feedback_submit_btn">Share my feedback</button>
                </form>
            </section>
        </section>
    )
}


export default FeedbackModal