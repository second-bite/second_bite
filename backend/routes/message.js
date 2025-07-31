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
        socket.on('send_message', async ({ receiver_consumer_id: receiver_consumer_id_, message }) => {
            let receiver_consumer_id = Number(receiver_consumer_id_)
            const consumer_id = session.user_id

            try {
                // Check message validity
                if(message === "" || !(typeof message === "string")) {
                    console.log('Missing message text')
                }
                
                const message_data = {
                    message: message,
                    sender_consumer_id: consumer_id,
                    receiver_consumer_id: receiver_consumer_id,
                }

                // Record order
                await prisma.message.create({
                    data: message_data
                })

                // Notify receiver
                io.to(`consumer:${receiver_consumer_id}`).emit('new_incoming_message', {sender_consumer_id: consumer_id, message})
            } catch (err) {
                console.error(err)
            }
        })

    })

    /**
     *  Normal Routes
     * */ 
    // Used to retrieve currently logged in consumer's messages with another consumer
    // NOTE: Consumer View
    router.get('/:consumer_id/:time_zone', check_auth(user_types_check.consumer), async (req, res, next) => {
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
            if(!is_time_zone_valid) return next({status: 400, message: `Time Zone parameter is invalid`})

            let messages = await prisma.message.findMany({
                where: {
                    OR: [
                        {sender_consumer_id: consumer_id, receiver_consumer_id: other_consumer_id},
                        {sender_consumer_id: other_consumer_id, receiver_consumer_id: consumer_id},
                    ]
                },
                orderBy: { created_at: 'asc' },
            })

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