const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')
const { Info, DateTime } = require('luxon')

const {user_types_check, check_auth} = require('./user_auth')

module.exports = (io) => {
    // Socket Handlers
    io.on('connection', (socket) => {
        const session = socket.request.session

        // Disconnect if not auth
        if (!session || !session.user_id) {
            return socket.disconnect();
        }

        // Join Socket.IO room to properly have received messages route in
        socket.join(`consumer:${session.user_id}`)

        // Send Message
        socket.on('send_message', async ({ receiver_consumer_id: receiver_consumer_id_, message, time_zone }) => {
            let receiver_consumer_id = Number(receiver_consumer_id_)
            const consumer_id = session.user_id

            try {
                // Check message validity
                if(message === "" || !(typeof message === "string")) {
                    console.log('Missing message text')
                    return
                }
                
                const message_data = {
                    message: message,
                    sender_consumer_id: consumer_id,
                    receiver_consumer_id: receiver_consumer_id,
                }

                // Record order
                const created_message = await prisma.message.create({
                    data: message_data
                })
                console.log('Created message')
                console.log(created_message)

                // Notify receiver
                io.to(`consumer:${receiver_consumer_id}`).emit('new_incoming_message', {
                    ...created_message,
                    created_at: DateTime.fromISO(created_message.created_at, { zone: 'utc' }).setZone(time_zone),
                    creation_time: DateTime.fromISO(created_message.created_at, { zone: 'utc' }).setZone(time_zone).toFormat('HH:mm'),
                    is_sender: false
                })
                io.to(`consumer:${consumer_id}`).emit(`new_sent_message`, {
                    ...created_message,
                    created_at: DateTime.fromISO(created_message.created_at, { zone: 'utc' }).setZone(time_zone),
                    creation_time: DateTime.fromISO(created_message.created_at, { zone: 'utc' }).setZone(time_zone).toFormat('HH:mm'),
                    is_sender: true,
                })
            } catch (err) {
                console.error(err)
            }
        })

    })

    /**
     *  Normal Routes
     * */ 
    // Used to retrieve currently logged in consumer's messages with friends for chat sidebar
    // NOTE: Consumer View
    router.get('/friends/:time_zone', check_auth(user_types_check.consumer), async (req, res) => {
        let {time_zone} = req.params
        const consumer_id = req.session.user_id


        try {
            // Check if user's time zone is valid
            let is_time_zone_valid = false
            try {
                Intl.DateTimeFormat(undefined, { timeZone: time_zone });
                is_time_zone_valid = true;
            } catch (ex) {
                is_time_zone_valid = false;
            }
            if(!is_time_zone_valid) {
                console.error(`Time Zone parameter is invalid`)
                return
            }

            // Get friends
            let friendships = await prisma.friendship.findMany({
                where: {
                    OR: [
                        {consumer_id_a: consumer_id},
                        {consumer_id_b: consumer_id},
                    ]
                },
                include: {
                    friend_a: true,
                    friend_b: true,
                }
            })

            // Re-map to only include friends
            friendships = await Promise.all(friendships.map(async (friendship) => {
                let friend_consumer_id = null
                let friend_username = null
                if(friendship.consumer_id_a === consumer_id) {
                    friend_consumer_id = friendship.consumer_id_b
                    friend_username = friendship.friend_b.username
                } 
                else {
                    friend_consumer_id = friendship.consumer_id_a
                    friend_username = friendship.friend_a.username
                }

                let messages = await prisma.message.findMany({
                    where: {
                        OR: [
                            {sender_consumer_id: consumer_id, receiver_consumer_id: friend_consumer_id},
                            {sender_consumer_id: friend_consumer_id, receiver_consumer_id: consumer_id},
                        ]
                    },
                    orderBy: { created_at: 'desc' }, // Latest first
                    take: 1,
                })

                return {
                    friend_consumer_id: friend_consumer_id,
                    friend_username: friend_username,
                    latest_message: (messages.length === 0) ? 'No messages exchanged yet' : messages[0].message,
                    created_at: (messages.length === 0) ? '' : DateTime.fromISO(messages[0].created_at, { zone: 'utc' }).setZone(time_zone).toFormat('HH:mm'),
                }
            }))

            res.status(200).json(friendships)
        } catch (err) {
            console.error(err)
        }
    })


    // Used to retrieve currently logged in consumer's messages with another consumer
    // NOTE: Consumer View
    router.get('/chat/:consumer_id/:time_zone', check_auth(user_types_check.consumer), async (req, res) => {
        let {consumer_id: other_consumer_id, time_zone} = req.params
        other_consumer_id = Number(other_consumer_id)
        const consumer_id = req.session.user_id


        try {
            // Check if user's time zone is valid
            let is_time_zone_valid = false
            try {
                Intl.DateTimeFormat(undefined, { timeZone: time_zone });
                is_time_zone_valid = true;
            } catch (ex) {
                is_time_zone_valid = false;
            }
            if(!is_time_zone_valid) {
                console.error(`Time Zone parameter is invalid`)
                return
            }

            let messages = await prisma.message.findMany({
                where: {
                    OR: [
                        {sender_consumer_id: consumer_id, receiver_consumer_id: other_consumer_id},
                        {sender_consumer_id: other_consumer_id, receiver_consumer_id: consumer_id},
                    ]
                },
                orderBy: { created_at: 'asc' },
            })
            console.log(messages)

            messages = messages.map((message) => ({
                ...message,
                created_at: DateTime.fromISO(message.created_at, { zone: 'utc' }).setZone(time_zone),
                creation_time: DateTime.fromISO(message.created_at, { zone: 'utc' }).setZone(time_zone).toFormat('HH:mm'), 
                is_sender: (message.sender_consumer_id === consumer_id) ? true : false, 
            }))
            res.status(200).json(messages)
        } catch (err) {
            console.error(err)
        }
    })

    return router
}