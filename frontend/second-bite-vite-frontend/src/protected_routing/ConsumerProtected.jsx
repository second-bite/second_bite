import React, {useContext} from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { FadeLoader } from 'react-spinners'


const ConsumerProtected = () => {
    const {AUTH_STATUS, auth_status, is_loading} = useContext(AuthContext)

    if(is_loading) return <FadeLoader />

    if(auth_status !== AUTH_STATUS.CONSUMER_AUTH) return <Navigate to='/auth' replace={true} />

    return <Outlet /> // Render child route
}


export default ConsumerProtected