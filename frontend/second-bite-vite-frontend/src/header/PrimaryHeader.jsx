import React, {useState, useContext} from 'react'

import { useNavigate } from 'react-router-dom'

import { AppContext } from '../App'

const PrimaryHeader = () => {
    const navigate = useNavigate()

    const [is_popup_visible, setIsPopupVisible] = useState(false)
    const {setIsFeedbackModal} = useContext(AppContext)

    const handlePageNavClick = () => setIsPopupVisible((prev_is_popup_visible) => !prev_is_popup_visible)
    const handleFeedbackClick = () => setIsFeedbackModal(true)

    const handleAccountInfoClick = () => {
        navigate('/account')
    }

    return (
        <header className="primary_header">
            <h1>SecondBite</h1>
            <section className="account">
                <p className="page_nav" onClick={handlePageNavClick}>≡</p>
                {is_popup_visible && 
                    <section id="page_nav_popup">
                        <section className="page_nav_option" onClick={handleAccountInfoClick}>
                            <img src='/account_avatar.webp' alt='avatar icon' id="avatar_img" className="page_nav_option_img" />
                            <p className="page_nav_option_text">Account Info</p>
                        </section>
                        <section className="page_nav_option">
                            <img src='/vite.svg' alt="" className="page_nav_option_img" />
                            <p className="page_nav_option_text">Starred Restaurants</p>
                        </section>
                        <section className="page_nav_option">
                            <img src='/vite.svg' alt="" className="page_nav_option_img" />
                            <p className="page_nav_option_text">Past Restaurants</p>
                        </section>
                        <section className="page_nav_option" onClick={handleFeedbackClick}>
                            <img src='/vite.svg' alt="" className="page_nav_option_img" />
                            <p className="page_nav_option_text">Feedback</p>
                        </section>
                    </section>
                }
            </section>
        </header>
    )
}


export default PrimaryHeader