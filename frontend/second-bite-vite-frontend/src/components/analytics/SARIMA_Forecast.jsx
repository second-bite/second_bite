 import React, {  } from "react"


const SARIMA_Forecast = () => {
    const handleClick = async () => {
        // Due to vite.config.js, request gets proxied to recommendation_url (needed to transmit cookie for recommendation API calls)
        const response = await fetch(`/forecast/${1309}/month`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    return (
        <button type="button" onClick={() => handleClick()}>SARIMA Click</button>
    )
}


export default SARIMA_Forecast