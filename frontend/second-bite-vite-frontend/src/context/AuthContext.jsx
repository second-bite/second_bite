import React, {useState, useContext, createContext, useEffect} from "react"
import { AppContext } from "./AppContext"

import { log_error } from '../utils/utils'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const AUTH_STATUS = {
        UNAUTH: 'unauth',
        OWNER_AUTH: 'owner_auth',
        CONSUMER_AUTH: 'consumer_auth',
    }

    // Same as backend
    const USER_TYPES = {
        CONSUMER : 'consumer',
        OWNER: 'owner',
    }

    const { base_url } = useContext(AppContext)

    const [auth_status, setAuthStatus] = useState(null)
    const [is_loading, setIsLoading] = useState(false)

    // Checks logged in status initially & on page refresh/navigation
    useEffect(() => {
        // Check auth status
        const checkStatus = async () =>  {
            try {
                setIsLoading(true)
                const response = await fetch(base_url + '/auth/check_session', {
                    method: 'GET',
                    credentials: 'include',
                })
                if(!response.ok) {
                    const err_msg = await response.json().message
                    const err = new Error(`Status Code: ${response.status}. ErrMsg: ${err_msg}`)
                    err.status = response.status
                    throw new err
                }

                const res_json = await response.json()
                if(res_json.user_type === USER_TYPES.CONSUMER) {
                    await setAuthStatus(AUTH_STATUS.CONSUMER_AUTH)
                }
                else if (res_json.user_type === USER_TYPES.OWNER) {
                    await setAuthStatus(AUTH_STATUS.OWNER_AUTH)
                }
                else {
                    const err = new Error('Unknown user type')
                    err.status = response.status
                    throw new err
                }
            } catch(err) {
                await log_error(err)
                setAuthStatus(AUTH_STATUS.UNAUTH)
            } finally {
                setIsLoading(false)
            }
        }
        
        checkStatus()
    }, [])

    return (
        <AuthContext.Provider value={{AUTH_STATUS, auth_status, setAuthStatus, is_loading, setIsLoading}}>
            {children}
        </AuthContext.Provider>
    )
}