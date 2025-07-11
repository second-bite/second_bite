import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import { AppContext } from "../../context/AppContext"


const Stars = ({is_stars_displayed, setNumStars}) => {
    const [stars_color, setStarsColor] = useState(['gray', 'gray', 'gray', 'gray', 'gray'])

    const toggleStar = (star_num) => {
        setStarsColor((prev_stars_color) => (
            prev_stars_color.map((_, ind) => (ind <= star_num) ?  'gold' : 'gray')
        ))
        setNumStars(star_num + 1) // Star num is zero-indexed (for consistency with color array indices)
    }

    // Make all stars un-selected on un-mount
    useEffect(() => {
        return ( () => {
            setNumStars(0)
            setStarsColor(['gray', 'gray', 'gray', 'gray', 'gray'])
        })
    }, [])

    useEffect(() => {
        if(!is_stars_displayed) {
            setNumStars(0)
            setStarsColor(['gray', 'gray', 'gray', 'gray', 'gray'])
        }
    }, [is_stars_displayed])

    return(
        <section className="stars">
            <p className="star" name="rating_star1" onClick={() => toggleStar(0)} style={{color: stars_color[0]}}>★</p>
            <p className="star" name="rating_star2" onClick={() => toggleStar(1)} style={{color: stars_color[1]}}>★</p>
            <p className="star" name="rating_star3" onClick={() => toggleStar(2)} style={{color: stars_color[2]}}>★</p>
            <p className="star" name="rating_star4" onClick={() => toggleStar(3)} style={{color: stars_color[3]}}>★</p>
            <p className="star" name="rating_star5" onClick={() => toggleStar(4)} style={{color: stars_color[4]}}>★</p>
        </section>
    )
}

Stars.propTypes = {
    setNumStars: PropTypes.func.isRequired
}


export default Stars