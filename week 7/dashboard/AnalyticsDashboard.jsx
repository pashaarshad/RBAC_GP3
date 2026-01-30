import React, { useState } from 'react';
import QueryCountChart from './charts/QueryCountChart';
import DepartmentUsageChart from './charts/DepartmentUsageChart';
import AccessTrendChart from './charts/AccessTrendChart';
import { mockData } from './mockData';
import './AnalyticsDashboard.css';

/**
 * AnalyticsDashboard Component
 * Main dashboard component that orchestrates all analytics visualizations
 * Displays:
 * - Real-time system metrics
 * - Query count trends
 * - Department usage distribution
 * - Access control trends
 */
const AnalyticsDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const {
    queryCountData,
    departmentUsageData,
    accessTrendsData,
    summaryMetrics,
  } = mockData;

  return (
    <div className={`analytics-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            📊 RBAC Chatbot Analytics Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Real-time system usage and access control metrics
          </p>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleDarkMode}
          title="Toggle dark mode"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Summary Metrics Cards */}
      <section className="metrics-section">
        <h2 className="section-title">Key Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <h3 className="metric-label">Total Queries</h3>
            <p className="metric-value">
              {summaryMetrics.totalQueries.toLocaleString()}
            </p>
            <p className="metric-subtitle">Last 30 Days</p>
          </div>

          <div className="metric-card">
            <div className="metric-icon">✅</div>
            <h3 className="metric-label">Success Rate</h3>
            <p className="metric-value">{summaryMetrics.successRate}%</p>
            <p className="metric-subtitle">Query Success</p>
          </div>

          <div className="metric-card">
            <div className="metric-icon">👥</div>
            <h3 className="metric-label">Active Users</h3>
            <p className="metric-value">
              {summaryMetrics.activeUsers.toLocaleString()}
            </p>
            <p className="metric-subtitle">Current Period</p>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⚡</div>
            <h3 className="metric-label">Avg Response Time</h3>
            <p className="metric-value">{summaryMetrics.avgResponseTime}ms</p>
            <p className="metric-subtitle">System Performance</p>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🚫</div>
            <h3 className="metric-label">Denied Access</h3>
            <p className="metric-value">
              {summaryMetrics.deniedAccessCount}
            </p>
            <p className="metric-subtitle">RBAC Rejections</p>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🛡️</div>
            <h3 className="metric-label">System Uptime</h3>
            <p className="metric-value">{summaryMetrics.systemUptime}%</p>
            <p className="metric-subtitle">Availability</p>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <h2 className="section-title">Usage Analytics</h2>
        <div className="charts-container">
          {/* Query Count Chart */}
          <div className="chart-wrapper full-width">
            <QueryCountChart data={queryCountData} />
          </div>

          {/* Department Usage and Access Trends - Side by side */}
          <div className="charts-row">
            <div className="chart-wrapper half-width">
              <DepartmentUsageChart data={departmentUsageData} />
            </div>
            <div className="chart-wrapper half-width">
              <AccessTrendChart data={accessTrendsData} />
            </div>
          </div>
        </div>
      </section>

      {/* System Information Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p className="footer-text">
            <strong>Team Gamma</strong> • Data Visualization & Knowledge Base
          </p>
          <p className="footer-text">
            RBAC Chatbot Analytics System • Last Updated: January 30, 2026
          </p>
          <p className="footer-note">
            All data shown is sample/mock data for demonstration purposes.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AnalyticsDashboard;
