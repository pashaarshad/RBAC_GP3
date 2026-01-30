import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getDepartmentColor } from '../mockData';

/**
 * DepartmentUsageChart Component
 * Displays department-wise chatbot usage distribution using a pie chart
 * Shows relative usage across Finance, HR, Engineering, Marketing, and General departments
 */
const DepartmentUsageChart = ({ data }) => {
  const COLORS = data.map((item) => getDepartmentColor(item.name));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value">
            Queries: {payload[0].value.toLocaleString()}
          </p>
          <p className="tooltip-percentage">{payload[0].payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Department-wise Usage Distribution</h3>
      <p className="chart-description">
        Breakdown of chatbot queries by department
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name} ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="usage-stats">
        <h4>Usage Breakdown</h4>
        <div className="stats-grid">
          {data.map((item) => (
            <div key={item.name} className="stat-item">
              <div className="stat-color" style={{ backgroundColor: getDepartmentColor(item.name) }}></div>
              <div className="stat-info">
                <span className="stat-label">{item.name}</span>
                <span className="stat-value">{item.value.toLocaleString()} ({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentUsageChart;
