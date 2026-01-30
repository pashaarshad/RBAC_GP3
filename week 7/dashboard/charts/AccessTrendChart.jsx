import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getAccessTrendColors } from '../mockData';

/**
 * AccessTrendChart Component
 * Displays access control trends across time periods using a stacked bar chart
 * Shows granted access, denied access, and total access per week
 */
const AccessTrendChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Access Trends Over Time</h3>
      <p className="chart-description">
        Weekly breakdown of granted vs. denied access requests
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="week"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Access Count', angle: -90, position: 'insideLeft' }}
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            verticalAlign="bottom"
            height={36}
          />
          <Bar
            dataKey="grantedAccess"
            stackId="access"
            fill={getAccessTrendColors.grantedAccess}
            name="Granted Access"
            radius={[8, 8, 0, 0]}
            animationDuration={600}
          />
          <Bar
            dataKey="deniedAccess"
            stackId="access"
            fill={getAccessTrendColors.deniedAccess}
            name="Denied Access"
            radius={[8, 8, 0, 0]}
            animationDuration={600}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="trend-stats">
        <h4>Access Statistics</h4>
        <div className="stats-grid">
          {data.map((item) => (
            <div key={item.week} className="stat-item">
              <div className="stat-info">
                <span className="stat-label">{item.week}</span>
                <div className="stat-details">
                  <span className="stat-value">
                    ✓ {item.grantedAccess.toLocaleString()} granted
                  </span>
                  <span className="stat-value denied">
                    ✗ {item.deniedAccess.toLocaleString()} denied
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessTrendChart;
