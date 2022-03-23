import React, { useState, useCallback } from 'react';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../../../styles.scss';

export default function Chart({title, data, dataKey, grid}) {

    const [value, setValue] = useState();

    const onChange = useCallback(
        (value) => {
          setValue(value);
        },
        [setValue],
      );

    return (
        <div className="chart">
            <span className="chart-title">{title}</span>
            <ResponsiveContainer width="100%" aspect={5/1}>
                <LineChart data={data}>
                    <XAxis dataKey="month"/>
                    <Line type="monotone" dataKey={dataKey}/>
                    <Tooltip/>
                    {grid && <CartesianGrid stroke="#D1D5DB" strokeDasharray="5 5"/>}
                </LineChart>
            </ResponsiveContainer>
            </div>

    )
}
