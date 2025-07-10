import React, { useRef, useState, PureComponent } from "react"

// Tailwind Imports
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Button, Typography, MenuHandler, MenuList, Card, CardBody } from "@material-tailwind/react";

// Rechart Imports
import { PieChart, Pie, Sector, Cell, BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { log_error } from "../../utils/utils"
import KpiCards from "./KPIs";


const Analytics = () => {
    const restaurant_ref = useRef()
    const graph_ref = useRef()

    const GRAPH_TYPE = {
        ORDERS: "Orders",
        REVENUE: "Revenue",
        PAGE_VISITS: "Page Visits"
    }

    const [selected_restaurant, setSelectedRestaurant] = useState('Mezze Cafe')
    const [selected_graph, setSelectedGraph] = useState(GRAPH_TYPE.ORDERS)

    // Handlers
    const handleRestaurantSelect = (selection) => {
        // TODO: Add validation
        setSelectedRestaurant(selection)
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
                {selected_restaurant}
                <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
            </MenuButton>
            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none
                            data-closed:scale-95 data-closed:transform data-closed:opacity-0
                            data-enter:duration-100 data-enter:ease-out
                            data-leave:duration-75 data-leave:ease-in"
            >
                <MenuItem onClick={() => {handleRestaurantSelect('Mezze Cafe')}}>
                {({ active }) => (
                    <a
                    href="#"
                    className={`block px-4 py-2 text-sm text-gray-600 ${
                        active ? 'bg-gray-100 text-gray-900' : ''
                    }`}
                    >
                    Mezze Cafe
                    </a>
                )}
                </MenuItem>
                <MenuItem onClick={() => {handleRestaurantSelect('Bento Box')}}>
                {({ active }) => (
                    <a
                    href="#"
                    className={`block px-4 py-2 text-sm text-gray-600 ${
                        active ? 'bg-gray-100 text-gray-900' : ''
                    }`}
                    >
                    Bento Box
                    </a>
                )}
                </MenuItem>
            </MenuItems>
            </Menu>

            {/* KPIs */}
            <KpiCards />

            <section className="analytics_graph_section" ref={graph_ref}>
                <details className="dropdown">
                <summary className="btn m-1">{selected_graph}</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li><a onClick={() => {handleGraphSelect('Orders')}}>Orders</a></li>
                    <li><a onClick={() => {handleGraphSelect('Revenue')}}>Revenue</a></li>
                    <li><a onClick={() => {handleGraphSelect('Page Visits')}}>Page Visits</a></li>
                </ul>
                </details>
                <section className="analytics_graph">
                    <img src="analytics_graph.png" alt="Sample Analytics Graph" />
                </section>
            </section>

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