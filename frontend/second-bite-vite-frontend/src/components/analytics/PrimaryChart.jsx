import React from "react"

import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'


const PrimaryChart = () => {
    // Primary Chart Data
    const initialData = [
    { name: 1, cost: 4.11, impression: 100 },
    { name: 2, cost: 2.39, impression: 120 },
    { name: 3, cost: 1.37, impression: 150 },
    { name: 4, cost: 1.16, impression: 180 },
    { name: 5, cost: 2.29, impression: 200 },
    { name: 6, cost: 3, impression: 499 },
    { name: 7, cost: 0.53, impression: 50 },
    { name: 8, cost: 2.52, impression: 100 },
    { name: 9, cost: 1.79, impression: 200 },
    { name: 10, cost: 2.94, impression: 222 },
    { name: 11, cost: 4.3, impression: 210 },
    { name: 12, cost: 4.41, impression: 300 },
    { name: 13, cost: 2.1, impression: 50 },
    { name: 14, cost: 8, impression: 190 },
    { name: 15, cost: 0, impression: 300 },
    { name: 16, cost: 9, impression: 400 },
    { name: 17, cost: 3, impression: 200 },
    { name: 18, cost: 2, impression: 50 },
    { name: 19, cost: 3, impression: 100 },
    { name: 20, cost: 7, impression: 100 },
    ];

    const getAxisYDomain = (from, to, ref, offset) => {
        const refData = initialData.slice(from - 1, to);
        let [bottom, top] = [refData[0][ref], refData[0][ref]];
        refData.forEach((d) => {
          if (d[ref] > top) top = d[ref];
          if (d[ref] < bottom) bottom = d[ref];
        });
    
        return [(bottom | 0) - offset, (top | 0) + offset];
    };

    const initialState = {
        data: initialData,
        left: 'dataMin',
        right: 'dataMax',
        refAreaLeft: '',
        refAreaRight: '',
        top: 'dataMax+1',
        bottom: 'dataMin-1',
        top2: 'dataMax+20',
        bottom2: 'dataMin-20',
        animation: true,
    };

    const data = [
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
        <>
            {/* Primary Chart */}
            {/* Code largely taken from https://recharts.org/en-US/examples/ComposedChartWithAxisLabels */}
            <section className="analytics_graph">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                    width={500}
                    height={400}
                    data={data}
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
        </>
    )
}


export default PrimaryChart