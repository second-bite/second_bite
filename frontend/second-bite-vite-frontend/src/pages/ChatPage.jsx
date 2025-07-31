import React, {useState} from 'react'

import PrimaryHeader from '../header/PrimaryHeader';
import FriendSearch from '../components/messaging/FriendSearch'
import Chat from '../components/messaging/Chat'

const ChatPage = () => {

    return (
        <>
            <PrimaryHeader />
            <main className="messaging_parent">
                <FriendSearch />
                <Chat />
            </main>
        </>
    );
}


export default ChatPage