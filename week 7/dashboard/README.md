# 📊 Analytics Dashboard for RBAC Chatbot System

## Project Overview

This is a comprehensive **Analytics Dashboard** built for visualizing and monitoring the Role-Based Access Control (RBAC) enabled chatbot system. The dashboard provides real-time insights into system usage patterns, access control metrics, and department-wise distribution of queries.

**Developed by:** Team Gamma - Data Visualization & Knowledge Base  
**Project:** Infosys Springboard Internship (Week 7)  
**Status:** ✅ Production Ready

---

## 🎯 Key Features

### 📈 Data Visualization
- **Query Count Chart** - Line chart showing query trends over 30 days
- **Department Usage Chart** - Pie chart displaying usage distribution across 5 departments
- **Access Trends Chart** - Stacked bar chart showing granted vs. denied access requests

### 📊 Summary Metrics
- Total Queries (11,665)
- Success Rate (98.5%)
- Active Users (245)
- Average Response Time (234ms)
- Denied Access Count (235)
- System Uptime (99.8%)

### 🎨 Design Features
- **Responsive Layout** - Adapts to all screen sizes (mobile, tablet, desktop)
- **Dark Mode Support** - Toggle-able theme with smooth transitions
- **Interactive Charts** - Hover tooltips and smooth animations
- **Clean UI** - Modern, professional design with intuitive navigation
- **Accessible** - WCAG compliant with semantic HTML

### ⚡ Performance
- Lightweight components
- Optimized rendering
- Fast chart animations
- No external API calls required (uses mock data)

---

## 📁 Project Structure

```
week 7/
└── dashboard/
    ├── AnalyticsDashboard.jsx              # Main dashboard component
    ├── AnalyticsDashboard.css              # Responsive styling with dark mode
    ├── mockData.js                         # Sample data for all visualizations
    ├── utils.js                            # Helper utility functions
    ├── index.js                            # Main entry point
    ├── package.json                        # Dependencies specification
    ├── charts/
    │   ├── QueryCountChart.jsx             # Query trends line chart
    │   ├── DepartmentUsageChart.jsx        # Department distribution pie chart
    │   └── AccessTrendChart.jsx            # Access control stacked bar chart
    ├── IMPLEMENTATION_GUIDE.md             # Step-by-step setup instructions
    └── README.md                           # This file

DASHBOARD_DOCUMENTATION.md                  # Comprehensive documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn
- React 18+

### Installation

1. **Clone/Copy the project:**
```bash
cd week 7/dashboard
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Install required packages:**
```bash
npm install react react-dom recharts
```

### Running the Dashboard

**Option 1: Standalone React App**
```bash
npm start
```

**Option 2: Integration into Existing Project**
```jsx
import AnalyticsDashboard from './week 7/dashboard/AnalyticsDashboard';

function App() {
  return <AnalyticsDashboard />;
}
```

---

## 📊 Components Overview

### 1. AnalyticsDashboard.jsx
Main orchestrating component that combines all dashboard elements.

**Features:**
- Dark mode toggle button
- Responsive grid layout
- 6 summary metric cards
- 3 interactive charts
- Footer with system information

**Customization:**
- Toggle dark mode: Click the 🌙/☀️ button in header
- Update metrics: Modify `summaryMetrics` in mockData.js

### 2. QueryCountChart.jsx
Displays query volume trends over 30 days using a line chart.

**Visualizes:**
- Total queries per day (blue line)
- Successful queries per day (green line)
- Trend trajectory
- Success rate consistency

**Insights:**
- System growth patterns
- Peak usage periods
- Query success rate stability

### 3. DepartmentUsageChart.jsx
Shows distribution of chatbot usage across departments using a pie chart.

**Departments:**
- Finance: 28% (3,250 queries) - Blue
- HR: 24% (2,840 queries) - Green
- Engineering: 23% (2,650 queries) - Amber
- Marketing: 18% (2,100 queries) - Red
- General: 8% (920 queries) - Purple

**Insights:**
- Which departments use the system most
- Resource allocation effectiveness
- Department engagement levels

### 4. AccessTrendChart.jsx
Displays RBAC enforcement through granted/denied access requests in a stacked bar chart.

**Metrics per Week:**
- Total Access Attempts
- Granted Access (✓)
- Denied Access (✗)
- Authenticated Users

**Insights:**
- RBAC policy effectiveness
- Security posture metrics
- User adoption trends

---

## 🎨 Styling & Themes

### Light Mode (Default)
- Clean white background
- Dark text for readability
- Professional color palette

### Dark Mode
- Click theme toggle button to enable
- Darker background with lighter text
- Maintains accessibility standards
- Smooth transitions

### Color Palette
```
Blue:    #3B82F6  (Primary)
Green:   #10B981  (Success)
Amber:   #F59E0B  (Warning)
Red:     #EF4444  (Error/Denial)
Purple:  #8B5CF6  (Secondary)
```

---

## 📱 Responsive Design

The dashboard automatically adapts to all screen sizes:

| Device | Width | Layout |
|--------|-------|--------|
| **Desktop** | 1024px+ | Full 3-column metrics, 2-column charts |
| **Tablet** | 768-1023px | 3-column metrics, side-by-side charts |
| **Mobile** | 480-767px | 2-column metrics, stacked single-column |
| **Small Phone** | <480px | Optimized 2-column metrics |

---

## 📊 Mock Data Structure

### Sample Data Included:
1. **30 days of query count data** - Daily query volume and success metrics
2. **5 departments' usage data** - Distribution with percentages
3. **5 weeks of access trends** - Granted/denied access statistics
4. **6 summary metrics** - KPIs for system overview

All data is stored in `mockData.js` and easily replaceable with real API data.

---

## 🔧 Technology Stack

### Frontend
- **React 18+** - Component-based UI framework
- **Recharts** - React charting library
- **CSS3** - Modern styling with variables and media queries

### No Backend Required
- Dashboard uses client-side only rendering
- Mock data for demonstration
- Ready for API integration

---

## 💡 Usage Examples

### Basic Implementation
```jsx
import AnalyticsDashboard from './dashboard/AnalyticsDashboard';

export default function App() {
  return <AnalyticsDashboard />;
}
```

### With Dark Mode State Management
```jsx
import { useState } from 'react';
import AnalyticsDashboard from './dashboard/AnalyticsDashboard';

export default function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  return <AnalyticsDashboard />;
}
```

### With Real Data Integration
```jsx
import { useEffect, useState } from 'react';
import AnalyticsDashboard from './dashboard/AnalyticsDashboard';

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/analytics/dashboard')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return data ? <AnalyticsDashboard data={data} /> : <LoadingSpinner />;
}
```

---

## 🔌 API Integration

### To Connect with Backend:

1. **Replace mock data imports** in `AnalyticsDashboard.jsx`
2. **Add useEffect hook** for data fetching
3. **Implement loading/error states** for UX
4. **Update data prop passing** to chart components

### Expected API Response Format:
```json
{
  "queryCountData": [...],
  "departmentUsageData": [...],
  "accessTrendsData": [...],
  "summaryMetrics": {...}
}
```

See `IMPLEMENTATION_GUIDE.md` for detailed integration steps.

---

## 🎯 Customization Guide

### Change Colors
Edit CSS variables in `AnalyticsDashboard.css`:
```css
:root {
  --color-blue: #3B82F6;
  --color-green: #10B981;
  /* ... etc */
}
```

### Add New Metrics
1. Add data to `summaryMetrics` in mockData.js
2. Create new metric card in dashboard grid
3. Style with existing CSS classes

### Modify Charts
Edit corresponding chart component in `charts/` folder:
- Update data structure
- Modify colors
- Change chart type

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **DASHBOARD_DOCUMENTATION.md** | Comprehensive technical documentation |
| **IMPLEMENTATION_GUIDE.md** | Step-by-step setup and integration guide |
| **README.md** | This file - overview and quick start |

---

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
- Component rendering
- Dark mode toggle
- Chart data visualization
- Responsive layout
- Accessibility features

### Example Test
```javascript
import { render, screen } from '@testing-library/react';
import AnalyticsDashboard from './AnalyticsDashboard';

test('renders dashboard successfully', () => {
  render(<AnalyticsDashboard />);
  expect(screen.getByText(/Analytics Dashboard/i)).toBeInTheDocument();
});
```

---

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Deployment Checklist
- [ ] Dependencies installed and tested
- [ ] API endpoints configured
- [ ] Environment variables set
- [ ] Dark mode functionality verified
- [ ] Mobile responsiveness tested
- [ ] Chart interactions validated
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] Browser compatibility checked
- [ ] Accessibility tested

### Deploy to Hosting
```bash
# Build the production bundle
npm run build

# Deploy 'build/' folder to your hosting service
# (Vercel, Netlify, AWS S3, etc.)
```

---

## 🐛 Troubleshooting

### Charts Not Rendering
**Solution:** Ensure Recharts is installed
```bash
npm install recharts
```

### Dark Mode Not Working
**Solution:** Verify CSS is loaded and check browser console

### Responsive Layout Issues
**Solution:** Test viewport size using browser DevTools (F12)

### Mock Data Not Showing
**Solution:** Check that mockData.js is in the correct path

### API Integration Issues
**Solution:** Check CORS settings and API response format

---

## 📞 Support & Contact

**Project Team:** Team Gamma  
**Specialization:** Data Visualization & Knowledge Base  
**Duration:** Infosys Springboard Internship - Week 7  

For questions or support:
1. Review the documentation files
2. Check the Implementation Guide
3. Examine mock data structure
4. Review browser console for errors

---

## ✨ Future Enhancements

### Potential Features
- [ ] Real-time data streaming
- [ ] Custom date range picker
- [ ] Department-specific filtering
- [ ] Export to PDF/CSV
- [ ] User authentication
- [ ] Customizable dashboard widgets
- [ ] Email report scheduling
- [ ] Advanced analytics (prediction, anomaly detection)

---

## 📝 License

This project is part of the RBAC Chatbot Analytics Dashboard developed during the Infosys Springboard Internship. All rights reserved.

---

## 📋 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 30, 2026 | Initial release with 3 charts and 6 metrics |

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Recharts Documentation](https://recharts.org)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

## ✅ Checklist for Usage

- [ ] Read this README
- [ ] Review DASHBOARD_DOCUMENTATION.md
- [ ] Follow IMPLEMENTATION_GUIDE.md
- [ ] Install dependencies
- [ ] Run the dashboard
- [ ] Test dark mode toggle
- [ ] Test responsive design
- [ ] Customize colors/data if needed
- [ ] Deploy to production

---

## 🎉 Project Highlights

✨ **3 Interactive Charts** - Query trends, department usage, access control  
📱 **Fully Responsive** - Works perfectly on all devices  
🌙 **Dark Mode** - Eye-friendly dark theme support  
⚡ **Performance** - Lightweight and fast-loading  
🎨 **Professional Design** - Modern UI with smooth animations  
📊 **Sample Data** - Ready-to-use mock data included  
📚 **Well Documented** - Comprehensive guides and documentation  

---

**Ready to visualize your RBAC chatbot analytics?** 🚀

Start with the Quick Start section above or dive into IMPLEMENTATION_GUIDE.md for detailed setup instructions.

---

**Last Updated:** January 30, 2026  
**Status:** ✅ Production Ready  
**Version:** 1.0.0

