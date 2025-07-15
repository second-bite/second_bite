import React, { useRef, useState, useEffect, PureComponent, useContext } from "react"

// Tailwind Imports
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

// Rechart Imports
import { PieChart, Pie, Cell, ComposedChart, Line, Area, BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Internal Imports
import { log_error } from "../../utils/utils"
import KpiCards from "./KPIs";
import { AppContext } from "../../context/AppContext";
import { currency_formatter } from "../../utils/utils"

const Analytics = () => {
    const { base_url } = useContext(AppContext)

    // enums
    const GRAPH_TYPE = {
        ORDERS: "Orders",
        REVENUE: "Revenue",
        PAGE_VISITS: "Page Visits"
    }
    const KPI_TIME_RANGE = {
        LAST_WEEK: "Last Week",
        LAST_MONTH: "Last Month",
    }

    // Colors (for graphs)
    const new_vs_existing_colors = ['#0088FE', '#00C49F']
    const orders_grouped_by_weekday_colors = ['#0088FE', '#00C49F', '#FF69B4', '#8BC34A', '#FFC107', '#2196F3', '#9C27B0']

    // State Variables
    const [selected_restaurant, setSelectedRestaurant] = useState({})
    const [kpi_time_range, setKPITimeRange] = useState(KPI_TIME_RANGE.LAST_WEEK)
    const [selected_graph, setSelectedGraph] = useState(GRAPH_TYPE.ORDERS)
    const [owned_restaurants, setOwnedRestaurants] = useState([]) // Array of owned restaurants
    const [orders, setOrders] = useState([]) // Dynamically changed in KPIs.jsx as KPI Time Range changes
    const [visits, setVisits] = useState([]) // Dynamically changed in KPIs.jsx as KPI Time Range changes
    const [new_vs_existing_data, setNewVsExistingData] = useState([])
    const [top_consumers_data, setTopConsumersData] = useState([])
    const [orders_grouped_by_weekday_data, setOrdersGroupedByWeekdayData] = useState([])

    // Getters
    const getOwnerRestaurants = async () => {
        // Fetch owner info from DB
        let data
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
        if(owned_restaurants.length > 0) setSelectedRestaurant(data.restaurants[0])
    }
    const getNewVsExistingData = () => {
        // Get total number of new customers 
        // NOTE: This approach works b/c we're only looking at a single restaurant and a consumer can only be first-time for a given restaurant once
        const num_new_customers = orders.reduce((num_new_customers, order) => (order.is_first_order) ? (num_new_customers + 1) : (num_new_customers), 0)

        // Group based on consumers
        let consumer_id_set = new Set()
        for(const order of orders) {
            if(!consumer_id_set.has(order.consumer_id)) {
                consumer_id_set.add(order.consumer_id)
            }
        }
        const total_num_consumers = consumer_id_set.size
        const num_non_first_time_consumers = total_num_consumers - num_new_customers

        // Update State Variable
        const updated_new_vs_existing_data = [
            {name: 'New Consumers', value: num_new_customers},
            {name: 'Existing Consumers', value: num_non_first_time_consumers},
        ]
        setNewVsExistingData(updated_new_vs_existing_data)
    }
    const getTopConsumersData = () => {
        // Accumulate consumers based on descending total cost/revenue
        const aggregated_consumers_revenue_obj = orders.reduce((accumulator, order) => {
            const {consumer_id, cost} = order
            const {username} = order.consumer

            if(accumulator[consumer_id]) {
                accumulator[consumer_id].price += cost
            }
            else {
                accumulator[consumer_id] = {
                    username: username,
                    price: cost,
                }
            }

            return accumulator
        }, {})

        // Creates array of consumers (each entry containing all info necessary for bar chart)
        let aggregated_consumers_revenue_arr = []
        for(const consumer_to_price in aggregated_consumers_revenue_obj) {
            aggregated_consumers_revenue_arr.push([consumer_to_price, aggregated_consumers_revenue_obj[consumer_to_price].username, aggregated_consumers_revenue_obj[consumer_to_price].price])
        }

        // Sort consumers by descending total cost/revenue
        aggregated_consumers_revenue_arr.sort((a,b) => b[2] - a[2])

        // Retrieve Top Consumers Data for Bar Chart (takes top 4)
        const new_top_consumers_data = aggregated_consumers_revenue_arr.slice(0, 4).map((consumer_bar_info) => (
            {
                name: consumer_bar_info[1],
                price: consumer_bar_info[2]
            }
        ))

        // Update State Variable
        setTopConsumersData(new_top_consumers_data)
    }
    const getOrdersGroupedByWeekdayData = () => {
        const new_orders_grouped_by_weekday_data = [
            { name: 'Monday', value: 0 },
            { name: 'Tuesday', value: 0},
            { name: 'Wednesday', value: 0 },
            { name: 'Thursday', value: 0},
            { name: 'Friday', value: 0 },
            { name: 'Saturday', value: 0},
            { name: 'Sunday', value: 0 },
        ]

        for(const order of orders) {
            const day_ind = order.order_time.weekday - 1 // subtract one to make it zero-indexed
            new_orders_grouped_by_weekday_data[day_ind].value += 1
        }

        // Update State Variable
        setOrdersGroupedByWeekdayData(new_orders_grouped_by_weekday_data)
    }

    // Load Info on Startup
    useEffect(() => {
        getOwnerRestaurants()
    }, [])

    // Change supplementary graph data as orders change
    useEffect(() => {
        getNewVsExistingData()
        getTopConsumersData()
        getOrdersGroupedByWeekdayData()
    }, [orders])

    // Handlers
    const handleRestaurantSelect = (restaurant) => {
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
            <KpiCards restaurant_id={selected_restaurant.restaurant_id} KPI_TIME_RANGE={KPI_TIME_RANGE} kpi_time_range={kpi_time_range} setKPITimeRange={setKPITimeRange} setOrders={setOrders} setVisits={setVisits} />

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
                    <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">{`New vs Existing Consumers ` +  ((kpi_time_range === KPI_TIME_RANGE.LAST_WEEK) ? `(Past Week)` : `(Past Month)`)}</h3>
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
                    <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">{`Highest Frequency Customers `+  ((kpi_time_range === KPI_TIME_RANGE.LAST_WEEK) ? `(Past Week)` : `(Past Month)`)}</h3>
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
                            <YAxis label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="price" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                        </BarChart>
                    </ResponsiveContainer>
                </section>

                {/* Orders by Day of Week Pie Chart */}
                <section className="analytics_supplementary_graph">
                    <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">{`Orders by Day `+  ((kpi_time_range === KPI_TIME_RANGE.LAST_WEEK) ? `(Past Week)` : `(Past Month)`)}</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        {/* Code largely taken from https://recharts.org/en-US/examples/PieChartWithCustomizedLabel */}
                        <PieChart width={400} height={400}>
                            <Pie
                                data={orders_grouped_by_weekday_data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius="70%"
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {orders_grouped_by_weekday_data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={orders_grouped_by_weekday_colors[index % orders_grouped_by_weekday_colors.length]} />
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