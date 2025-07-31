import React from 'react'


const Chat = () => {
    return (
        <section className="chat">
            <p>Strawberry!</p>
            {/* Credit to: https://daisyui.com/components/chat/?lang=en */}
            <div className="chat chat-start">
            <div className="chat-bubble">
                It's over Anakin,
                <br />
                I have the high ground.
            </div>
            </div>
            <div className="chat chat-end">
            <div className="chat-bubble">You underestimate my power!</div>
            </div>
        </section>
    )
}


export default Chat