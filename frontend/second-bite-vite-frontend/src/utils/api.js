export const address_validation = async (street_address, city, state, postal_code) => {
    try {
        const embedded_api_key = import.meta.env.VITE_SMARTY_EMBEDDED_API_KEY
        const response = await fetch(`https://us-street.api.smarty.com/street-address?key=${embedded_api_key}&street=${encodeURIComponent(street_address)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&zipcode=${encodeURIComponent(postal_code)}`, {
            method: 'GET',

        })
        if(!response.ok) {
            throw new Error(`Status Code: ${response.status}. Failed to validate address using SMARTY API`)
        }
        const res_json = await response.json()
        // Should return a JSON array with the possible valid addresses
        if(res_json.length === 0) return false
        return true
    }
    catch (e) {
        console.error(e)
        return false
    }
}