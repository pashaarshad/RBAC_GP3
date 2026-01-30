# RBAC Chatbot Analytics Dashboard - Documentation

## 📊 Overview

The Analytics Dashboard is a comprehensive visual data layer for monitoring and analyzing the Role-Based Access Control (RBAC) enabled chatbot system. It provides real-time insights into system usage, access control patterns, and department-wise distribution of queries.

**Project Team:** Team Gamma - Data Visualization & Knowledge Base  
**Developed for:** Infosys Springboard Internship (Week 7)  
**Last Updated:** January 30, 2026

---

## 🎯 Dashboard Objectives

1. **Visualize System Usage** - Track query volumes and trends over time
2. **Monitor Access Control** - Display RBAC enforcement metrics (granted/denied access)
3. **Department Analytics** - Analyze usage patterns across different departments
4. **Performance Insights** - Provide system health and response time metrics
5. **User-Friendly Interface** - Present data in an accessible, clean format with dark mode support

---

## 📁 Project Structure

```
week 7/
└── dashboard/
    ├── AnalyticsDashboard.jsx          # Main dashboard component
    ├── AnalyticsDashboard.css          # Responsive styling with dark mode
    ├── mockData.js                     # Sample data for all charts
    └── charts/
        ├── QueryCountChart.jsx         # Query trends over time
        ├── DepartmentUsageChart.jsx    # Department usage distribution
        └── AccessTrendChart.jsx        # Access control trends
```

---

## 📈 Dashboard Components

### 1. **AnalyticsDashboard.jsx** (Main Component)
**Purpose:** Orchestrates all dashboard functionality and layout

**Features:**
- Dark mode toggle with persistent styling
- Responsive grid layout adapting to all screen sizes
- Summary metrics cards displaying key KPIs
- Container for all chart components
- Footer with system information

**Key Functions:**
- `toggleDarkMode()` - Switches between light and dark themes
- Renders 6 summary metric cards
- Manages layout for responsive design

**Props:** None (uses mock data from mockData.js)

---

### 2. **QueryCountChart.jsx**
**Chart Type:** Line Chart  
**Purpose:** Visualize query volume trends over the last 30 days

**Metrics Displayed:**
- **Total Queries** - All queries processed (blue line)
- **Successful Queries** - Successfully completed queries (green line)

**Key Features:**
- Dual-line visualization for comparison
- Interactive tooltips showing exact values
- Smooth animations for better UX
- Clear axis labels and legends
- X-axis: Calendar dates (Jan 1 - Jan 30)
- Y-axis: Query count

**Data Source:** `mockData.queryCountData`

**Insights Provided:**
- Overall system usage growth trajectory
- Success rate stability
- Peak usage periods
- System reliability metrics

---

### 3. **DepartmentUsageChart.jsx**
**Chart Type:** Pie Chart  
**Purpose:** Show distribution of chatbot usage across departments

**Departments Tracked:**
- **Finance** (28%, 3,250 queries) - Blue (#3B82F6)
- **HR** (24%, 2,840 queries) - Green (#10B981)
- **Engineering** (23%, 2,650 queries) - Amber (#F59E0B)
- **Marketing** (18%, 2,100 queries) - Red (#EF4444)
- **General** (8%, 920 queries) - Purple (#8B5CF6)

**Key Features:**
- Color-coded segments for each department
- Percentage labels directly on pie slices
- Interactive legend
- Custom tooltips with exact counts and percentages
- Usage breakdown table below chart

**Data Source:** `mockData.departmentUsageData`

**Insights Provided:**
- Which departments use the system most
- Resource allocation effectiveness
- Department-specific engagement levels
- Usage imbalance identification

---

### 4. **AccessTrendChart.jsx**
**Chart Type:** Stacked Bar Chart  
**Purpose:** Track RBAC access control decisions over weekly periods

**Metrics Tracked:**
- **Granted Access** (Green) - Successfully authorized requests
- **Denied Access** (Red) - RBAC rejection due to insufficient permissions
- **Total Access** - Combined access attempts
- **Authenticated Users** - Active users per week

**Time Periods:** 5 weeks of historical data

**Key Features:**
- Stacked bars showing granted vs. denied distribution
- Clear visual separation of allowed/rejected access
- Weekly granularity for trend analysis
- Detailed statistics table below chart
- Custom tooltips with breakdown

**Data Source:** `mockData.accessTrendsData`

**Insights Provided:**
- RBAC policy effectiveness
- Security posture (lower denied % = better)
- User adoption trends
- Access denial patterns
- System security metrics

---

## 🎨 Color Scheme

### Primary Colors
| Component | Color | Hex |
|-----------|-------|-----|
| Primary Brand | Blue | #3B82F6 |
| Success/Growth | Green | #10B981 |
| Warning/Attention | Amber | #F59E0B |
| Denial/Error | Red | #EF4444 |
| Secondary | Purple | #8B5CF6 |

### Light Mode
- Background: #FFFFFF (Cards), #F9FAFB (Main)
- Text: #1F2937 (Primary), #6B7280 (Secondary)
- Borders: #E5E7EB

### Dark Mode
- Background: #1F2937 (Cards), #111827 (Main)
- Text: #F3F4F6 (Primary), #D1D5DB (Secondary)
- Borders: #4B5563

---

## 📊 Summary Metrics Cards

The dashboard displays 6 key performance indicators:

| Metric | Value | Description |
|--------|-------|-------------|
| Total Queries | 11,665 | Cumulative queries processed in last 30 days |
| Success Rate | 98.5% | Percentage of successfully processed queries |
| Active Users | 245 | Total unique authenticated users in current period |
| Avg Response Time | 234ms | Average system response latency |
| Denied Access | 235 | RBAC rejections due to insufficient permissions |
| System Uptime | 99.8% | Service availability percentage |

---

## 🔧 Technology Stack

### Frontend Framework
- **React 18+** - Component-based UI library
- **Recharts** - React charting library

### Styling
- **CSS3** - Custom styles with CSS variables
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - CSS variable-based theme switching

### Data Management
- **Mock Data (mockData.js)** - Sample data for demonstration
- **No Backend Required** - Client-side only

---

## 🚀 Installation & Setup

### Prerequisites
```bash
# Required packages
npm install react recharts
```

### Component Integration

1. **Import Dashboard Component:**
```jsx
import AnalyticsDashboard from './week 7/dashboard/AnalyticsDashboard';
```

2. **Render in App:**
```jsx
function App() {
  return <AnalyticsDashboard />;
}
```

3. **Ensure CSS is Loaded:**
```jsx
import './week 7/dashboard/AnalyticsDashboard.css';
```

### File Imports
The AnalyticsDashboard automatically imports:
- Individual chart components from `./charts/`
- Mock data from `./mockData.js`
- Styles from `./AnalyticsDashboard.css`

---

## 💡 Key Features

### 1. **Responsive Design**
- Desktop (1024px+): Full multi-column layout
- Tablet (768px-1023px): Adjusted grid with 2-column charts
- Mobile (480px-767px): Single-column stacked layout
- Small Mobile (<480px): Optimized 2-column metric cards

### 2. **Dark Mode Support**
- Toggle button in header (🌙/☀️)
- Smooth transitions between themes
- Respects system preferences
- CSS variables for easy theme switching

### 3. **Interactive Charts**
- Hover tooltips with detailed information
- Smooth animations on load
- Responsive to container size
- Color-coded legends

### 4. **Accessibility**
- Semantic HTML structure
- ARIA labels for buttons
- Readable color contrasts
- Keyboard navigation support

### 5. **Performance**
- Lightweight mock data
- Optimized chart rendering
- CSS animations (GPU accelerated)
- Minimal re-renders

---

## 📋 Mock Data Structure

### queryCountData
```javascript
[
  { date: 'Jan 1', queries: 120, successfulQueries: 115 },
  { date: 'Jan 2', queries: 145, successfulQueries: 140 },
  // ... 30 days of data
]
```

### departmentUsageData
```javascript
[
  { name: 'Finance', value: 3250, percentage: 28 },
  { name: 'HR', value: 2840, percentage: 24 },
  // ...
]
```

### accessTrendsData
```javascript
[
  {
    week: 'Week 1',
    totalAccess: 450,
    deniedAccess: 28,
    grantedAccess: 422,
    authenticatedUsers: 85
  },
  // ...
]
```

---

## 🔄 Future Enhancements

### Potential Extensions
1. **Backend Integration**
   - Connect to real RBAC system database
   - Live data streaming
   - Real-time metric updates

2. **Advanced Filtering**
   - Date range picker for custom periods
   - Department-specific filters
   - User role filtering

3. **Export Functionality**
   - PDF report generation
   - CSV data export
   - Screenshot sharing

4. **Additional Metrics**
   - Query response time histogram
   - Error rate analysis
   - User activity heatmap
   - Access denial reasons breakdown

5. **Customization**
   - Dashboard widget configuration
   - Metric threshold alerts
   - Custom metric definitions

---

## 🐛 Troubleshooting

### Charts Not Rendering
- Ensure Recharts is installed: `npm install recharts`
- Check console for error messages
- Verify mock data is imported correctly

### Dark Mode Not Working
- Ensure CSS file is loaded
- Check browser console for CSS errors
- Verify `dark-mode` class is toggled on body element

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Check for CSS variable support in your browser
- Verify CSS file path is correct

### Responsive Layout Issues
- Test viewport size using browser dev tools
- Check CSS media queries are applied
- Ensure container has sufficient space

---

## 📱 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Safari | 12+ | ✅ Full |
| Android Chrome | 90+ | ✅ Full |

---

## 📞 Support & Contact

**Project Team:** Team Gamma  
**Role:** Data Visualization & Knowledge Base  
**Period:** Week 7 (Infosys Springboard Internship)  
**Contact:** [Team Gamma Coordinator]

---

## 📝 Notes for Developers

1. **Extending Charts:**
   - Create new chart files in `/charts/` folder
   - Follow naming convention: `[ChartName]Chart.jsx`
   - Import Recharts components as needed
   - Add corresponding mock data in `mockData.js`

2. **Adding New Metrics:**
   - Add to `summaryMetrics` object in `mockData.js`
   - Create new metric card in dashboard grid
   - Use consistent styling with existing cards

3. **Data Integration:**
   - Replace mock data import with API calls
   - Implement loading states
   - Add error handling for API failures
   - Consider caching strategies

4. **Style Customization:**
   - Modify CSS variables in `:root` selector
   - Update color values in `mockData.js` getDepartmentColor()
   - Test in both light and dark modes

---

## 📄 License

This dashboard is part of the RBAC Chatbot project developed during the Infosys Springboard Internship. All rights reserved.

---

**Last Reviewed:** January 30, 2026  
**Status:** ✅ Production Ready  
**Version:** 1.0.0

