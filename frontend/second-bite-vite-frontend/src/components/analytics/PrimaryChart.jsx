import React from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


const PrimaryChart = ({orders, visits}) => {
    // Primary Chart Data
    const data = [
      {
        name: 'Page A',
        uv: 4000, // TODO: Site Visits
        pv: 2400, // TODO: Num Orders
      },
      {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
      },
      {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
      },
      {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
      },
      {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
      },
      {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
      },
      {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
      },
    ];

    return (
        <>
            <section className="analytics_graph">
              {/* Primary Chart */}
              {/* Code largely taken from https://recharts.org/en-US/examples/BiaxialLineChart */}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </section>
        </>
    )
}


export default PrimaryChart