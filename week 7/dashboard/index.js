/**
 * Main entry point for Analytics Dashboard components
 * Exports all dashboard components and utilities
 */

// Main Dashboard Component
export { default as AnalyticsDashboard } from './AnalyticsDashboard';

// Chart Components
export { default as QueryCountChart } from './charts/QueryCountChart';
export { default as DepartmentUsageChart } from './charts/DepartmentUsageChart';
export { default as AccessTrendChart } from './charts/AccessTrendChart';

// Data and Utilities
export { mockData, getDepartmentColor, getAccessTrendColors } from './mockData';
export * from './utils';

// CSS
import './AnalyticsDashboard.css';
