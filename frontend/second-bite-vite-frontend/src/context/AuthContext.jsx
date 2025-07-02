import React, {useState, createContext} from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const AUTH_STATUS = {
        UNAUTH: 'unauth',
        OWNER_AUTH: 'owner_auth',
        CONSUMER_AUTH: 'consumer_auth',
    }
    const [is_authenticated, setIsAuthenticated] = useState(false)
    const [is_loading, setIsLoading] = useState(false)

    return (
        <AuthContext.Provider value={{is_authenticated, setIsAuthenticated, is_loading, setIsLoading}}>
            {children}
        </AuthContext.Provider>
    )
}