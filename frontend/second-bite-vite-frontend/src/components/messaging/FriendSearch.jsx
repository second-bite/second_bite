import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { AppContext } from '../../context/AppContext'

const FriendSearch = () => {
    const navigate = useNavigate()
    const [chat_list, setChatList] = useState([])
    const {base_url, message_receiver_consumer_id, setMessageReceiverConsumerID} = useContext(AppContext)

    // Handlers
    const handleAccountReturn = () => {
        navigate('/main')
    }
    const handleFriendSearch = (event) => {
        event.preventDefault()
        // TODO:
    }
    const handleOpenFriendChat = (friend_consumer_id) => {
        if(message_receiver_consumer_id !== friend_consumer_id) setMessageReceiverConsumerID(friend_consumer_id)
    }

    useEffect(() => {
        const fetchFriendsChatList = async () => {
            try {
                console.log
                const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone
                const response = await fetch(base_url + `/message/friends/${encodeURIComponent(time_zone)}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                })
                const data = await response.json()

                setChatList(data)
            } catch (err) {
                console.error('Failed to fetch friends chat list')
            }
        }
        fetchFriendsChatList()
    }, [])

    return (
        <section className="friend_search_sidebar h-screen overflow-y-auto">
            <button type="button" className="account_return_btn" onClick={handleAccountReturn}>←</button>
            <h3 className="flex justify-center font-sans text-gray-600 text-xl font-semibold leading-snug mb-4 mt-8">
                Messages
            </h3>
            <form className="flex w-3/4 justify-center mx-auto mt-6" onSubmit={event => {handleFriendSearch(event)}}>
                <label htmlFor="friend-search" className="sr-only">Search friends</label>
                <div className="relative w-full">
                    {/* LEFT: now a clickable submit button */}
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                        <button type="submit" className="w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none" aria-label="Search">
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </button>
                    </div>

                    {/* INPUT: extra left-padding to separate text & buttom */}
                    <input type="search" id="friend-search" className="block w-full p-3 ps-16 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Search Friends..." />
                </div>
            </form>

            <section className="friend_chat_searches">
                {
                    chat_list.map((element) => (
                        <section className="friend_chat_search" onClick={() => handleOpenFriendChat(element.friend_consumer_id)}>
                            <section className="flex flex-col pl-[10px] gap=[10px]"> 
                                <div className="flex px-4 py-2">
                                    <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                        <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                                    </div>
                                    <section className="pl-3">
                                        <p className="font-semibold">{element.friend_username}</p>
                                        <p className="text-gray-500 text-[15px] truncate">{element.latest_message}</p>
                                    </section>
                                </div>                                   
                            </section>
                            <hr className="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                        </section>
                    ))
                }
            </section>
        </section>
    )
}


export default FriendSearch