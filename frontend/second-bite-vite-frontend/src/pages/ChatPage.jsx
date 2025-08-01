import React, {useState, useEffect, useRef, useContext} from 'react'
import io from 'socket.io-client'

import PrimaryHeader from '../header/PrimaryHeader';
import FriendSearch from '../components/messaging/FriendSearch'
import Chat from '../components/messaging/Chat'
import { AppContext } from '../context/AppContext';

const ChatPage = () => {
    const {base_url} = useContext(AppContext)
    const [socket, setSocket] = useState(null);


    useEffect(() => {
        // Set up socket to listen for sent/received messages
        const socket_ = io(base_url, {
            withCredentials: true,
        })

        setSocket(socket_)

        return () => {
            socket_.disconnect()
        }
    }, [])

    return (
        <>
            <PrimaryHeader />
            <main className="messaging_parent">
                <FriendSearch socket={socket}/>
                <Chat socket={socket}/>
            </main>
        </>
    );
}


export default ChatPage