const prisma = require('../routes/prisma_client')
import { faker } from '@faker-js/faker'
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
    for (let i = 0; i < NUM_CONSUMERS; i++) {
        const password = password.
        const data = {
            username: faker.internet.username()
            password
        }

        const consumer = await prisma.consumer.create({
            data: data
        })

        consumers.push(consumer)
    }

    // Generate Owners


    // Generate Restaurants


    // Generate Favorites


    // Generate PageVisits


    // Generate Orders
}
