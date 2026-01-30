// Mock Data for Analytics Dashboard
// Sample data representing RBAC chatbot system usage patterns

export const mockData = {
  // Query Count Over Time (Last 30 days)
  queryCountData: [
    { date: 'Jan 1', queries: 120, successfulQueries: 115 },
    { date: 'Jan 2', queries: 145, successfulQueries: 140 },
    { date: 'Jan 3', queries: 165, successfulQueries: 160 },
    { date: 'Jan 4', queries: 210, successfulQueries: 205 },
    { date: 'Jan 5', queries: 195, successfulQueries: 188 },
    { date: 'Jan 6', queries: 240, successfulQueries: 235 },
    { date: 'Jan 7', queries: 280, successfulQueries: 272 },
    { date: 'Jan 8', queries: 265, successfulQueries: 260 },
    { date: 'Jan 9', queries: 310, successfulQueries: 305 },
    { date: 'Jan 10', queries: 325, successfulQueries: 318 },
    { date: 'Jan 11', queries: 340, successfulQueries: 335 },
    { date: 'Jan 12', queries: 370, successfulQueries: 365 },
    { date: 'Jan 13', queries: 385, successfulQueries: 380 },
    { date: 'Jan 14', queries: 410, successfulQueries: 405 },
    { date: 'Jan 15', queries: 450, successfulQueries: 445 },
    { date: 'Jan 16', queries: 480, successfulQueries: 475 },
    { date: 'Jan 17', queries: 520, successfulQueries: 515 },
    { date: 'Jan 18', queries: 550, successfulQueries: 540 },
    { date: 'Jan 19', queries: 580, successfulQueries: 570 },
    { date: 'Jan 20', queries: 620, successfulQueries: 615 },
    { date: 'Jan 21', queries: 650, successfulQueries: 640 },
    { date: 'Jan 22', queries: 680, successfulQueries: 675 },
    { date: 'Jan 23', queries: 700, successfulQueries: 690 },
    { date: 'Jan 24', queries: 720, successfulQueries: 710 },
    { date: 'Jan 25', queries: 760, successfulQueries: 750 },
    { date: 'Jan 26', queries: 800, successfulQueries: 790 },
    { date: 'Jan 27', queries: 850, successfulQueries: 840 },
    { date: 'Jan 28', queries: 920, successfulQueries: 910 },
    { date: 'Jan 29', queries: 980, successfulQueries: 970 },
    { date: 'Jan 30', queries: 1050, successfulQueries: 1040 },
  ],

  // Department-wise Usage
  departmentUsageData: [
    { name: 'Finance', value: 3250, percentage: 28 },
    { name: 'HR', value: 2840, percentage: 24 },
    { name: 'Engineering', value: 2650, percentage: 23 },
    { name: 'Marketing', value: 2100, percentage: 18 },
    { name: 'General', value: 920, percentage: 8 },
  ],

  // Access Trends (Weekly breakdown)
  accessTrendsData: [
    {
      week: 'Week 1',
      totalAccess: 450,
      deniedAccess: 28,
      grantedAccess: 422,
      authenticatedUsers: 85,
    },
    {
      week: 'Week 2',
      totalAccess: 680,
      deniedAccess: 35,
      grantedAccess: 645,
      authenticatedUsers: 120,
    },
    {
      week: 'Week 3',
      totalAccess: 920,
      deniedAccess: 42,
      grantedAccess: 878,
      authenticatedUsers: 155,
    },
    {
      week: 'Week 4',
      totalAccess: 1280,
      deniedAccess: 58,
      grantedAccess: 1222,
      authenticatedUsers: 200,
    },
    {
      week: 'Week 5',
      totalAccess: 1620,
      deniedAccess: 72,
      grantedAccess: 1548,
      authenticatedUsers: 245,
    },
  ],

  // Summary Metrics
  summaryMetrics: {
    totalQueries: 11665,
    successRate: 98.5,
    activeUsers: 245,
    avgResponseTime: 234, // milliseconds
    deniedAccessCount: 235,
    systemUptime: 99.8, // percentage
  },
};

// Helper function to get department color
export const getDepartmentColor = (departmentName) => {
  const colorMap = {
    Finance: '#3B82F6',      // Blue
    HR: '#10B981',           // Green
    Engineering: '#F59E0B',  // Amber
    Marketing: '#EF4444',    // Red
    General: '#8B5CF6',      // Purple
  };
  return colorMap[departmentName] || '#6B7280';
};

// Helper function to get access trend colors
export const getAccessTrendColors = {
  grantedAccess: '#10B981',
  deniedAccess: '#EF4444',
  totalAccess: '#3B82F6',
};
