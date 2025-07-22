const prisma = require('../routes/prisma_client')
import { faker } from '@faker-js/faker/locale/en_US'
const argon2 = require('argon2')

async function main() {
    // Configuration Params
    const NUM_CONSUMERS = 8000
    const NUM_OWNERS = 400
    const NUM_RESTAURANTS = 1200
    const NUM_FAVORITES = 12000
    const NUM_VISITS = 100000
    const NUM_ORDERS = 50000
    const START_DATE = new Date().setFullYear(new Date().getFullYear() - 3) // 3 years ago
    const END_DATE = new Date()

    // Generate Consumers
    const consumers = []
    const consumer_username_set = new Set()
    for (let i = 0; i < NUM_CONSUMERS; i++) {
        let is_username_already_exists = true
        let username = null
        while (is_username_already_exists) {
            username = faker.internet.username
            if(!consumer_username_set.has(username)) {
                consumer_username_set.add(username)
                is_username_already_exists = false
            }
        }

        const hashed_pwd = await argon2.hash(faker.internet.password)

        const data = {
            username: username,
            password: hashed_pwd,
            address: {
                create: {
                    street_address: faker.address.streetAddress(),
                    city:           faker.address.city(),
                    state:          faker.address.stateAbbr(),
                    postal_code:    faker.address.zipCode(),
                    country:        faker.address.country()
                }
            }
        }

        const consumer = await prisma.consumer.create({
            data: data
        })

        consumers.push(consumer)
    }


    // Generate Owners
    const owners = []
    const owner_username_set = new Set()
    for (let i = 0; i < NUM_OWNERS; i++) {
        let is_username_already_exists = true
        let username = null
        while (is_username_already_exists) {
            username = faker.internet.username
            if(!owner_username_set.has(username)) {
                owner_username_set.add(username)
                is_username_already_exists = false
            }
        }

        const hashed_pwd = await argon2.hash(faker.internet.password)

        const data = {
            username: username,
            password: hashed_pwd,
            address: {
                create: {
                    street_address: faker.address.streetAddress(),
                    city:           faker.address.city(),
                    state:          faker.address.stateAbbr(),
                    postal_code:    faker.address.zipCode(),
                    country:        faker.address.country()
                }
            }
        }

        const owner = await prisma.owner.create({
            data: data
        })

        owners.push(owner)
    }

    // Generate Restaurants


    // Generate Favorites


    // Generate PageVisits


    // Generate Orders
}
