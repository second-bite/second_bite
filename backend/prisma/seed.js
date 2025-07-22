const prisma = require('../routes/prisma_client')
const { faker } = require('@faker-js/faker/locale/en_US')
import { cuisine_filters_react_select } from '../../frontend/second-bite-vite-frontend/src/components/misc/FilterTypes'
const argon2 = require('argon2')

async function main() {
    // Configuration Params
    const NUM_CONSUMERS = 8000
    const NUM_OWNERS = 400
    const NUM_RESTAURANTS = 1200
    const NUM_RATINGS = 6000
    const NUM_FAVORITES = 12000
    const NUM_VISITS = 100000
    const NUM_ORDERS = 50000
    const START_DATE = new Date()
    START_DATE.setFullYear(START_DATE.getFullYear() - 3) // 3 years ago
    const END_DATE = new Date()
    END_DATE.setDate(END_DATE.getDate() - 2) // To avoid time zone issues with current day's operations

    // Utilities
    const generatePickupTimes = (num_times) => {
        const pickup_times = []

        for (let i = 0; i < num_times; i++) {
            if (Math.random() < 0.2) {
                pickup_times.push('N/A')
            } else {
                const hr = String(Math.floor(Math.random() * 24)).padStart(2, '0')
                const min = String(Math.floor(Math.random() * 60)).padStart(2, '0')
                pickup_times.push(`${hr}:${min}`)
            }
        }

        return pickup_times
    }
    const generateRandomPastISODate = () => {
        const rand_date = faker.date.between({ from: START_DATE, to: END_DATE })
        return rand_date.toISOString()
    }

    // Generate Consumers
    const consumers = []
    const consumer_username_set = new Set()
    for (let i = 0; i < NUM_CONSUMERS; i++) {
        let is_username_already_exists = true
        let username = null
        while (is_username_already_exists) {
            username = faker.internet.username()
            if(!consumer_username_set.has(username)) {
                consumer_username_set.add(username)
                is_username_already_exists = false
            }
        }

        const hashed_pwd = await argon2.hash(faker.internet.password())

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
            username = faker.internet.username()
            if(!owner_username_set.has(username)) {
                owner_username_set.add(username)
                is_username_already_exists = false
            }
        }

        const hashed_pwd = await argon2.hash(faker.internet.password())

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
    const categories = cuisine_filters_react_select.map(category => category.value)
    const restaurants = []
    for (let i = 0; i < NUM_RESTAURANTS; i++) {
        const owner = faker.helpers.arrayElement(owners)
        const num_categories = faker.datatype.number({ min: 1, max: 4 })
        const restaurant_categories = faker.helpers.arrayElements(categories, num_categories)

        const data = {
            name: faker.company.name() + ' ' + faker.random.word(),
            descr: faker.lorem.sentence(),
            address: {
                create: {
                    street_address: faker.address.streetAddress(),
                    city:           faker.address.city(),
                    state:          faker.address.stateAbbr(),
                    postal_code:    faker.address.zipCode(),
                    country:        faker.address.country()
                }
            },
            categories: restaurant_categories,
            img_url: faker.image.food(640, 480, true),
            img_alt: 'Food Image',
            avg_cost: faker.finance.amount(5, 18, 2),
            pickup_time: generatePickupTimes(7),
            time_zone: 'America/Los_Angeles',
            owner: {
                connect: {
                    owner_id: owner.owner_id
                }
            },
        }

        const restaurant = await prisma.restaurant.create({
            data: data
        })

        restaurants.push(restaurant)
    }


    // Generate Ratings
    for(let i = 0; i < NUM_RATINGS; i++) {
        const consumer = faker.helpers.arrayElement(consumers)
        const restaurant = faker.helpers.arrayElement(restaurants)

        const data = {
            num_stars: Math.floor((Math.random() * 5) + 1),
            consumer_id: consumer.consumer_id,
            restaurant_id: restaurant.restaurant_id,
        }

        const rating = await prisma.rating.create({
            data: data
        })
    }


    // Generate Favorites (specifically, toggle favorited statuses num favorites times)
    for (let i = 0; i < NUM_FAVORITES; i++) {
        const consumer = faker.helpers.arrayElement(consumers)
        const restaurant = faker.helpers.arrayElement(restaurants)

        // Extract current favorited status (or create if not yet existent)
        let consumer_favorite_status = await prisma.favorite.findUnique({
            where: { 
                consumer_id_restaurant_id: {
                    consumer_id: consumer_id,
                    restaurant_id: restaurant_id
                }
            },
            select: {
                is_favorited: true
            }
        })
        if(!consumer_favorite_status) {
            consumer_favorite_status = await prisma.favorite.create({
                data: {
                    consumer_id: consumer_id,
                    restaurant_id: restaurant_id
                },
                select: {
                    is_favorited: true
                }
            })
        }

        await prisma.favorite.update({
            where: {
                consumer_id_restaurant_id: {
                    consumer_id:   consumer.consumer_id,
                    restaurant_id: restaurant.restaurant_id
                }
            },
            data: {
                is_favorited: !consumer_favorite_status.is_favorited
            },
        })
    }


    // Generate PageVisits
    for (let i = 0; i < NUM_VISITS; i++) {
        const restaurant = faker.helpers.arrayElement(restaurants)
        const consumer = faker.helpers.arrayElement(consumers)

        const page_visit = await prisma.pageVisit.findFirst({
            where: {
                restaurant_id: restaurant.restaurant_id,
                consumer_id: consumer.consumer_id,
            }
        })

        const is_first_visit = !page_visit

        // TODO: Add Visit Time

        const data = {
            is_first_visit: is_first_visit,
            restaurant_id: restaurant.restaurant_id,
            consumer_id: consumer.consumer_id,
            visit_time: generateRandomPastISODate(),
        }

        const visit = await prisma.pageVisit.create({
            data: data
        })
    }


    // Generate Orders
    for (let i = 0; i < NUM_ORDERS; i++) {
        const restaurant = faker.helpers.arrayElement(restaurants)
        const consumer = faker.helpers.arrayElement(consumers)

        const order = await prisma.order.findFirst({
            where: {
                restaurant_id: restaurant.restaurant_id,
                consumer_id: consumer.consumer_id,
            }
        })

        const is_first_order = !order

        const data = {
            consumer:   { 
                connect: { 
                    consumer_id: consumer.consumer_id 
                } 
            },
            restaurant:   { 
                connect: { 
                    restaurant_id: restaurant.restaurant_id 
                } 
            },
            cost:         faker.finance.amount(5, 18, 2),
            is_first_order: is_first_order,
            order_time: generateRandomPastISODate(),
        }

        await prisma.order.create({
            data: data
        })
    }
}


main()
