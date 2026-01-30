# Analytics Dashboard - Implementation Guide

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install react react-dom recharts
```

### Step 2: Setup React App Structure

If creating a new React app, use Create React App:
```bash
npx create-react-app rbac-dashboard
cd rbac-dashboard
npm install recharts
```

### Step 3: Copy Dashboard Files

Copy all files from `week 7/dashboard/` to your project:
```
src/
└── components/
    └── AnalyticsDashboard/
        ├── AnalyticsDashboard.jsx
        ├── AnalyticsDashboard.css
        ├── mockData.js
        └── charts/
            ├── QueryCountChart.jsx
            ├── DepartmentUsageChart.jsx
            └── AccessTrendChart.jsx
```

### Step 4: Import in App

**App.jsx:**
```jsx
import './App.css';
import AnalyticsDashboard from './components/AnalyticsDashboard/AnalyticsDashboard';

function App() {
  return (
    <div className="App">
      <AnalyticsDashboard />
    </div>
  );
}

export default App;
```

### Step 5: Run the Application
```bash
npm start
```

Dashboard will be available at `http://localhost:3000`

---

## 📦 File Descriptions

### AnalyticsDashboard.jsx (Main Component)
- **Size:** ~180 lines
- **Function:** Orchestrates all dashboard elements
- **Key State:** `darkMode` - boolean for theme toggle
- **Renders:** Header, metrics grid, charts, footer

### charts/QueryCountChart.jsx
- **Size:** ~60 lines
- **Type:** Line Chart (Recharts)
- **Data:** 30-day query trends
- **Lines:** Total & Successful queries

### charts/DepartmentUsageChart.jsx
- **Size:** ~80 lines
- **Type:** Pie Chart (Recharts)
- **Data:** Department-wise distribution
- **Departments:** 5 categories with percentages

### charts/AccessTrendChart.jsx
- **Size:** ~85 lines
- **Type:** Stacked Bar Chart (Recharts)
- **Data:** Weekly access control metrics
- **Categories:** Granted vs. Denied access

### mockData.js
- **Size:** ~90 lines
- **Content:** Sample data for all visualizations
- **Helper Functions:** Color mapping, styling utilities

### AnalyticsDashboard.css
- **Size:** ~500 lines
- **Features:** Responsive design, dark mode, animations
- **Breakpoints:** Desktop, Tablet, Mobile (480px, 768px, 1024px)

---

## 🎨 Customization Guide

### Change Color Scheme

Edit `:root` variables in `AnalyticsDashboard.css`:

```css
:root {
  --color-blue: #3B82F6;      /* Primary */
  --color-green: #10B981;     /* Success */
  --color-amber: #F59E0B;     /* Warning */
  --color-red: #EF4444;       /* Error */
  --color-purple: #8B5CF6;    /* Secondary */
}
```

### Add New Department

1. **Add to mockData.js:**
```javascript
departmentUsageData: [
  { name: 'NewDept', value: 1500, percentage: 15 },
  // ... existing departments
]
```

2. **Update getDepartmentColor():**
```javascript
export const getDepartmentColor = (departmentName) => {
  const colorMap = {
    NewDept: '#YOUR_HEX_COLOR',
    // ... existing mappings
  };
  return colorMap[departmentName] || '#6B7280';
};
```

### Modify Chart Data Range

Edit date ranges in `mockData.js`:
```javascript
queryCountData: [
  { date: 'Your Date', queries: ###, successfulQueries: ### },
  // ... more entries
]
```

### Change Metric Cards

Edit metric values in `AnalyticsDashboard.jsx`:
```jsx
<div className="metric-card">
  <div className="metric-icon">📊</div>
  <h3 className="metric-label">New Metric</h3>
  <p className="metric-value">{newMetricValue}</p>
  <p className="metric-subtitle">Subtitle text</p>
</div>
```

---

## 🔌 Backend Integration

### Replace Mock Data with API Calls

**Step 1:** Update AnalyticsDashboard.jsx
```jsx
import { useState, useEffect } from 'react';

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  
  return (
    // ... dashboard with real data
  );
};
```

### API Endpoints Expected

```
GET /api/analytics/dashboard
Returns: {
  queryCountData: [...],
  departmentUsageData: [...],
  accessTrendsData: [...],
  summaryMetrics: {...}
}

GET /api/analytics/queries/daily
Returns: Daily query trends

GET /api/analytics/departments/usage
Returns: Department usage statistics

GET /api/analytics/access/weekly
Returns: Weekly access control metrics
```

---

## 📊 Data Format Reference

### Query Count Format
```javascript
{
  date: "Jan 1",           // String: Date label
  queries: 120,            // Number: Total queries
  successfulQueries: 115   // Number: Successful queries
}
```

### Department Usage Format
```javascript
{
  name: "Finance",         // String: Department name
  value: 3250,            // Number: Query count
  percentage: 28          // Number: Percentage of total
}
```

### Access Trend Format
```javascript
{
  week: "Week 1",                  // String: Time period
  totalAccess: 450,               // Number: Total access attempts
  deniedAccess: 28,               // Number: Denied/rejected
  grantedAccess: 422,             // Number: Granted/allowed
  authenticatedUsers: 85          // Number: Active users
}
```

### Summary Metrics Format
```javascript
{
  totalQueries: 11665,            // Number: Cumulative
  successRate: 98.5,              // Number: Percentage
  activeUsers: 245,               // Number: Count
  avgResponseTime: 234,           // Number: Milliseconds
  deniedAccessCount: 235,         // Number: Count
  systemUptime: 99.8              // Number: Percentage
}
```

---

## 🎯 Component Props

### AnalyticsDashboard
- **Props:** None (uses mockData directly)
- **State:** `darkMode` (boolean)
- **Returns:** Full dashboard JSX

### QueryCountChart
```jsx
<QueryCountChart 
  data={queryCountData}  // Array of query trend objects
/>
```

### DepartmentUsageChart
```jsx
<DepartmentUsageChart 
  data={departmentUsageData}  // Array of department objects
/>
```

### AccessTrendChart
```jsx
<AccessTrendChart 
  data={accessTrendsData}  // Array of weekly trend objects
/>
```

---

## 🧪 Testing

### Unit Test Example (Jest + React Testing Library)

```javascript
import { render, screen } from '@testing-library/react';
import AnalyticsDashboard from './AnalyticsDashboard';

describe('AnalyticsDashboard', () => {
  test('renders dashboard title', () => {
    render(<AnalyticsDashboard />);
    const title = screen.getByText(/Analytics Dashboard/i);
    expect(title).toBeInTheDocument();
  });

  test('displays all metric cards', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText(/Total Queries/i)).toBeInTheDocument();
    expect(screen.getByText(/Success Rate/i)).toBeInTheDocument();
  });

  test('renders all charts', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText(/Query Count Over Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Department-wise Usage/i)).toBeInTheDocument();
  });
});
```

---

## 📱 Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Desktop | 1024px+ | Full 3-column metrics, 2-column charts |
| Tablet | 768-1023px | 3-column metrics, stacked charts |
| Mobile | 480-767px | 2-column metrics, single column |
| Small | <480px | 2-column metrics, optimized |

---

## ⚠️ Known Limitations

1. **Mock Data Only** - Currently uses hardcoded sample data
2. **No Real-time Updates** - Data doesn't auto-refresh
3. **No Data Persistence** - Dashboard doesn't save user preferences
4. **Basic Filtering** - No date range or department filters
5. **Single User** - No user authentication/personalization

---

## 🔐 Security Considerations

When integrating with backend:

1. **API Authentication**
   - Use JWT tokens
   - Include authorization headers
   - Validate response data

2. **Data Validation**
   - Validate API responses before rendering
   - Implement error boundaries
   - Show user-friendly error messages

3. **XSS Prevention**
   - Escape dynamic content
   - Use React's built-in escaping
   - Validate external data

4. **CORS Setup**
   - Configure server-side CORS
   - Whitelist dashboard domain
   - Use secure cookie settings

---

## 📈 Performance Optimization Tips

1. **Code Splitting**
   - Lazy load chart components
   - Use React.lazy() and Suspense

2. **Memoization**
   - Wrap charts with React.memo
   - Use useMemo for expensive calculations

3. **Data Caching**
   - Implement client-side caching
   - Use React Query or SWR library

4. **Bundle Optimization**
   - Use Recharts minimal build
   - Tree shake unused dependencies

---

## 🚨 Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints updated for production
- [ ] Dark mode CSS tested
- [ ] Responsive design tested on mobile
- [ ] Bundle size optimized
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Browser compatibility verified
- [ ] Accessibility features tested
- [ ] Documentation updated

---

## 📞 Support

For questions or issues:
1. Check DASHBOARD_DOCUMENTATION.md
2. Review mock data structure
3. Check browser console for errors
4. Verify all dependencies installed
5. Test in different browsers

---

**Dashboard Version:** 1.0.0  
**Last Updated:** January 30, 2026  
**Status:** ✅ Ready for Production

