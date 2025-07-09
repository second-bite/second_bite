import React, { useContext, useState, useEffect } from "react"
import { AppContext } from "../../context/AppContext"
import { log_error } from "../../utils/utils";

let users = [
  {
    username: "johnDoe",
    userId: 1
  },
  {
    username: "janeDoe",
    userId: 2
  },
  {
    username: "aliceSmith",
    userId: 3
  },
  {
    username: "bobJohnson",
    userId: 4
  }
];

const FriendModal = () => {
    const {base_url, is_friend_modal, setIsFriendModal} = useContext(AppContext)
    const [friends, setFriends] = useState([])

    // Friend Modal Display Type
    const [friend_modal_title, setFriendModalTitle] = useState(`Sign Up`)
    const FORM_TYPE = {
        CURRENT_FRIENDS: 'current_friends',
        ADD_FRIENDS: 'add_friends',
    }
    const [form_status, setFormStatus] = useState(FORM_TYPE.CURRENT_FRIENDS)

    // Modal Title & Toggle Button Formatting
    useEffect(() => {
        if(form_status === FORM_TYPE.CURRENT_FRIENDS) setFriendModalTitle('Current Friends')
        else if(form_status === FORM_TYPE.ADD_FRIENDS) setFriendModalTitle('Add Friend')
    }, [form_status])
    const current_friend_btn_style = {
        "color": (form_status === FORM_TYPE.CURRENT_FRIENDS) ? "white" : "black",
        "background-color":  (form_status === FORM_TYPE.CURRENT_FRIENDS) ? "black" : "transparent"
    }
    const add_friend_btn_style = {
        "color": (form_status === FORM_TYPE.ADD_FRIENDS) ?  "white" : "black",
        "background-color": (form_status === FORM_TYPE.ADD_FRIENDS) ?  "black" : "transparent"       
    }
    const handleCurrentFriendsToggle = () => {
        console.log(form_status)
        if(!(form_status === FORM_TYPE.CURRENT_FRIENDS)) setFormStatus(FORM_TYPE.CURRENT_FRIENDS)
    }
    const handleAddFriendToggle = () => {
        console.log(form_status)
        if(!(form_status === FORM_TYPE.ADD_FRIENDS)) setFormStatus(FORM_TYPE.ADD_FRIENDS)
    }

    // Current Friends
    const getFriends = async () => {
        try {
            const response = await fetch(base_url + `/consumer/friend/all`, {
                method: `GET`,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            })
            if(!response.ok) {
                const err = new Error(`Status: ${response.status}. Error: ${res_json.message}`)
                err.status = response.status
                throw err
            } 

            const friends = await response.json()
            setFriends(friends)
        } catch (err) {
            log_error(err)
        }
    }

    useEffect(() => {
        getFriends()
    }, [is_friend_modal, form_status])

    // Friend Requests & Add Friends
    const getFriendRequestsNOtherConsumers = async () => {
        try {
            const response = await fetch(base_url + '/consumer/all_other', {
                method: 'GET',

            })
            // TODO: Other logic here
            // TODO: Store in different variables -> one for friend requests, one for available users to add
            // TODO: Add logic for accept/reject
            // TODO: Add logic for send friend request
        } catch (err) {
            log_error(err)
        }
    }

    useEffect(() => { // TODO: Make sure to run getFriendRequestsNOtherConsumers on each friend request send & friend request accept/reject 
        getFriendRequestsNOtherConsumers()
    }, [is_friend_modal, form_status])

    // Handlers
    const handleClose = () => {
        setIsFriendModal(false)
    }
    const handleClickoff = (event) => {
        if(event.target === event.currentTarget) handleClose()
    }

    return(
        <section className="modal_star_custom" style={{display: is_friend_modal ? "block" : "none"}} onClick={handleClickoff}>
            <section className="modal_content" id="friend_modal">
            <h2 className="text-2xl font-bold mt-6 mb-4" id="friend_h2">{friend_modal_title}</h2>
            <button type="button" className="close_btn" onClick={handleClose}>×</button>
                <section className="friend_toggle_btns">
                    <button style={current_friend_btn_style} id="current_friends_btn" className="friend_toggle_btn" onClick={handleCurrentFriendsToggle}>Current Friends</button>
                    <button style={add_friend_btn_style} id="add_friend_btn" className="friend_toggle_btn" onClick={handleAddFriendToggle}>Add Friend</button>
                </section>
                {
                    (form_status === FORM_TYPE.CURRENT_FRIENDS) ? 
                    (
                        <section className="current_friends_section">
                            {
                                friends.map((friend) => (
                                    <section className="current_friend">
                                        <section className="current_friend_container">                                    
                                            <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                                <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                                            </div>
                                            <section className="current_friend_info">
                                                <p className="current_friend_username">{friend.username}</p>
                                                <p className="current_friend_supp">Consumer</p>
                                            </section>
                                        </section>
                                        <hr class="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                                    </section>
                                ))
                            }
                        </section>
                    ) : 
                    (
                        <section className="add_friend_section">
                            <section className="incoming_friend_requests_section">
                                <h3 className="text-xl font-bold dark:text-white">Incoming Friend Requests</h3>
                                {
                                    users.map((user) => (
                                        <section className="incoming_friend_request">
                                            <section className="incoming_friend_request_container">
                                                <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                                    <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                                                </div>
                                                <section className="current_friend_info">
                                                    <p className="current_friend_username">{user.username}</p>
                                                    <p className="current_friend_supp">Consumer</p>
                                                </section>        
                                                <section className="incoming_friend_request_sections">
                                                    <button className="accept_friend_request_btn">Accept</button>
                                                    <button className="reject_friend_request_btn">Reject</button>
                                                </section> 
                                            </section>
                                            <hr class="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                                        </section>
                                    ))
                                }
                            </section>
                            <hr class="h-px my-8 bg-gray-200 border-0.5 dark:bg-gray-400"></hr>
                            <section className="available_users_section">
                                <h3 className="text-xl font-bold dark:text-white">Users</h3>
                                
                                {
                                    users.map((user) => (
                                        <section className="available_user">
                                            <section className="available_user_container">
                                                <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                                    <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                                                </div>
                                                <section className="current_friend_info">
                                                    <p className="current_friend_username">{user.username}</p>
                                                    <p className="current_friend_supp">Consumer</p>
                                                </section>         
                                                <button className="send_friend_request_btn"><img src="/add_user.png" alt="Send Friend Request Icon"/></button>
                                            </section>
                                            <hr class="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                                        </section>
                                    ))
                                }
                            </section>
                        </section>
                    )
                }
            </section>
        </section>
    )
}


export default FriendModal