import React, { useRef, useState, useEffect, PureComponent, useContext } from "react"

// Tailwind Imports
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Button, Typography, MenuHandler, MenuList, Card, CardBody } from "@material-tailwind/react";

// Rechart Imports
import { PieChart, Pie, Sector, Cell, ComposedChart, Line, Area, BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { log_error } from "../../utils/utils"
import KpiCards from "./KPIs";
import { AppContext } from "../../context/AppContext";

const Analytics = () => {
    const { base_url } = useContext(AppContext)

    const GRAPH_TYPE = {
        ORDERS: "Orders",
        REVENUE: "Revenue",
        PAGE_VISITS: "Page Visits"
    }

    // State Variables
    const [selected_restaurant, setSelectedRestaurant] = useState({})
    const [selected_graph, setSelectedGraph] = useState(GRAPH_TYPE.ORDERS)
    const [owned_restaurants, setOwnedRestaurants] = useState([]) // Array of owned restaurants

    // Getters
    const getOwnerRestaurants = async () => {
        // Fetch owner info from DB
        let data
        console.log('Called getOwnerRestaurants')
        try {
            const response = await fetch(base_url + '/owner', {
                method: 'GET',
                credentials: 'include',
            })
            const err = new Error(`Status: ${response.status}. Failed to retrieve owner info from DB`)
            err.status = response.status
            if(!response.ok) throw err
            data = await response.json()
        } catch (err) {
            await log_error(err)
        }

        setOwnedRestaurants(data.restaurants)
        if(owned_restaurants.length > 0) setSelectedRestaurant(owned_restaurants[0])
        console.log(data.restaurants)
    }

    // Load Info on Startup
    useEffect(() => {
        getOwnerRestaurants()
    }, [])

    // Handlers
    const handleRestaurantSelect = (restaurant) => {
        // TODO: Add validation
        setSelectedRestaurant(restaurant)
    }
    const handleGraphSelect = async (selection) => {
        try {
            const err = new Error(`Invalid graph type selected.`)
            err.status = 500
            if(!Object.values(GRAPH_TYPE).includes(selection)) throw err
            setSelectedGraph(selection)
        } catch (err) {
            await log_error(err)
        }
    }

    // New vs Existing Consumers Pie Chart Attributes
    const new_vs_existing_data = [
        { name: 'New Consumers', value: 68 },
        { name: 'Existing Consumers', value: 368}
    ]
    const new_vs_existing_colors = ['#0088FE', '#00C49F']
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Primary Chart Data
    const temp_data = [
    {
        name: 'Page A',
        uv: 590,
        pv: 800,
        amt: 1400,
    },
    {
        name: 'Page B',
        uv: 868,
        pv: 967,
        amt: 1506,
    },
    {
        name: 'Page C',
        uv: 1397,
        pv: 1098,
        amt: 989,
    },
    {
        name: 'Page D',
        uv: 1480,
        pv: 1200,
        amt: 1228,
    },
    {
        name: 'Page E',
        uv: 1520,
        pv: 1108,
        amt: 1100,
    },
    {
        name: 'Page F',
        uv: 1400,
        pv: 680,
        amt: 1700,
    },
    ];


    // Top Consumers Bar Chart Attributes
    const top_consumers_data = [
        {
            name: 'Bill Nye',
            uv: 4000,
            amt: 2400,
        },
        {
            name: 'Sabrina Carpenter',
            uv: 3000,
            amt: 2210,
        },
        {
            name: 'Mark Zuckerberg',
            uv: 2000,
            amt: 2290,
        },
        {
            name: 'Andrew Bosman',
            uv: 2780,
            amt: 2000,
        },
        {
            name: 'John Doe',
            uv: 1890,
            amt: 2181,
        },
    ];

    // Orders by Day of Week
    const orders_vs_weekday_data = [
        { name: 'Mondays', value: 68 },
        { name: 'Tuesday', value: 368},
        { name: 'Wednesday', value: 68 },
        { name: 'Thursday', value: 368},
        { name: 'Friday', value: 68 },
        { name: 'Saturday', value: 368},
        { name: 'Sunday', value: 68 },
    ]
    const orders_vs_weekday_colors = ['#0088FE', '#00C49F', '#FF69B4', '#8BC34A', '#FFC107', '#2196F3', '#9C27B0']
    // Main Chart (allow them to choose betweenr evenue, visits, etc)
    // KPIs (# orders, # visits, $ new visitors $ revenue) ------------------ Graphs
    return (
        <section className="analytics">
            <h2 className="text-2xl font-bold mt-6 mb-4">Business Name Analytics</h2>

            {/* Restaurant Dropdown */}
            <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                {selected_restaurant.name || 'Please Select a Restaurant:'}
                <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
            </MenuButton>
            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none
                            data-closed:scale-95 data-closed:transform data-closed:opacity-0
                            data-enter:duration-100 data-enter:ease-out
                            data-leave:duration-75 data-leave:ease-in"
            >
                {
                    owned_restaurants.map((restaurant) => (
                        <MenuItem onClick={() => {handleRestaurantSelect(restaurant)}}>
                        {({ active }) => (
                            <a
                            href="#"
                            className={`block px-4 py-2 text-sm text-gray-600 ${
                                active ? 'bg-gray-100 text-gray-900' : ''
                            }`}
                            >
                            {restaurant.name}
                            </a>
                        )}
                        </MenuItem>
                    ))
                }
            </MenuItems>
            </Menu>

            {/* KPIs */}
            <KpiCards />

            {/* Primary Chart */}
            {/* Code largely taken from https://recharts.org/en-US/examples/ComposedChartWithAxisLabels */}
            <section className="analytics_graph">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                    width={500}
                    height={400}
                    data={temp_data}
                    margin={{
                        top: 20,
                        right: 80,
                        bottom: 20,
                        left: 20,
                    }}
                    >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" label={{ value: 'Pages', position: 'insideBottomRight', offset: 0 }} scale="band" />
                    <YAxis label={{ value: 'Index', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
                    <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                    <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                    </ComposedChart>
                </ResponsiveContainer>
            </section>

            {/* Secondary Charts */}
            <section className="analytics_supplementary_graph_section">
                {/* New vs Existing Users Pie Chart */}
                <section className="analytics_supplementary_graph">
                    <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">{'New vs Existing Consumers (Past Month)'}</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        {/* Code largely taken from https://recharts.org/en-US/examples/PieChartWithCustomizedLabel */}
                        <PieChart width={400} height={400}>
                            <Pie
                                data={new_vs_existing_data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius="70%"
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {new_vs_existing_data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={new_vs_existing_colors[index % new_vs_existing_colors.length]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </section>

                {/* Highest Frequency Customers Bar Chart */}
                <section className="analytics_supplementary_graph">
                    <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">{'Highest Frequency Customers (Past Month)'}</h3>
                    {/* Code largely taken from https://recharts.org/en-US/api/BarChart */}
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        width={500}
                        height={300}
                        data={top_consumers_data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                        </BarChart>
                    </ResponsiveContainer>
                </section>

                {/* Orders by Day of Week Pie Chart */}
                <section className="analytics_supplementary_graph">
                    <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">{'Orders by Day (Past Month)'}</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        {/* Code largely taken from https://recharts.org/en-US/examples/PieChartWithCustomizedLabel */}
                        <PieChart width={400} height={400}>
                            <Pie
                                data={orders_vs_weekday_data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius="70%"
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {orders_vs_weekday_data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={orders_vs_weekday_colors[index % orders_vs_weekday_colors.length]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </section>
            </section>

        </section>
    )
}


export default Analytics