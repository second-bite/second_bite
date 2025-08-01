import React, { useRef, useState, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'

import { log_error } from '../../utils/utils'
import { AppContext } from '../../context/AppContext'

const Chat = ({ socket }) => {
    const form_ref = useRef()
    const {base_url, message_receiver_consumer_id} = useContext(AppContext)
    const [messages, setMessages] = useState([])

    // Handlers
    const handleMessageSend = async () => {
        const form = form_ref.current.elements
        try {
            if(form.message.value === "") {
                alert('Message must have a message body')
            }

            socket.emit('send_message', {
                receiver_consumer_id: message_receiver_consumer_id, 
                message: form.message.value,
                time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })

            form.message.value = ""
        } catch (err) {
            log_error(err)
        }
    }
    const handleChatHistoryFetch = async () => {
        const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const response = await fetch(base_url + `/message/chat/${message_receiver_consumer_id}/${encodeURIComponent(time_zone)}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()
        setMessages(data)
    }

    useEffect(() => {
        if(!socket) return

        // Get chat history
        handleChatHistoryFetch()

        // Add sent or received messages
        socket.on('new_incoming_message', (message) => {
            setMessages((prev_messages) => [
                message,
                ...prev_messages,
            ])
        })
        socket.on('new_sent_message', (message) => {
            setMessages((prev_messages) => [
                message,
                ...prev_messages,
            ])
        })

        return () => {
            socket.off('new_incoming_message')
            socket.off('new_sent_message')
        }
    }, [socket, message_receiver_consumer_id])

    // Scroll to bottom
    // TODO: 

    return (
        <>
            <Helmet>
                <link
                rel="stylesheet"
                href="https://unpkg.com/flowbite@1.4.4/dist/flowbite.min.css"
                />
                <script
                defer
                src="https://unpkg.com/flowbite@1.4.0/dist/flowbite.js"
                />
            </Helmet>
            <section id="chat">
                <section id="messages" className="flex flex-col-reverse gap-2 overflow-y-auto max-h-[92vh] px-4 py-2">
                    {/* Credit to: https://daisyui.com/components/chat/?lang=en */}
                    {
                        messages.map((message) => (
                            message.is_sender ? 
                                (<div className="chat chat-end">
                                    <div className="chat-bubble">{message.message}</div>
                                </div>)
                                :
                                (<div className="chat chat-start">
                                    <div className="chat-bubble">{message.message}</div>
                                </div>)
                        ))
                    }
                </section>
                {/* Chat Input - Credit: https://www.creative-tim.com/twcomponents/component/chatroom */}
                <div className="max-w-full ">
                    <form ref={form_ref}>
                        <label for="chat" className="sr-only">Your message</label>
                        <div className="flex items-center py-2 px-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                            <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>
                            </button>
                            <button type="button" className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd"></path></svg>
                            </button>
                            <textarea id="chat" name="message" rows="1" className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
                            <button type="button" onClick={() => handleMessageSend()} className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                                <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}


export default Chat