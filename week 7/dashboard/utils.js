// Utility functions for Analytics Dashboard

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
  return num.toLocaleString();
};

/**
 * Format percentage with one decimal place
 * @param {number} percentage - Percentage value
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (percentage) => {
  return `${percentage.toFixed(1)}%`;
};

/**
 * Calculate percentage from value and total
 * @param {number} value - Value to calculate percentage for
 * @param {number} total - Total value
 * @returns {number} - Calculated percentage
 */
export const calculatePercentage = (value, total) => {
  return (value / total) * 100;
};

/**
 * Format milliseconds to readable time format
 * @param {number} ms - Time in milliseconds
 * @returns {string} - Formatted time string
 */
export const formatTimeMs = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

/**
 * Calculate average from array of numbers
 * @param {array} array - Array of numbers
 * @returns {number} - Average value
 */
export const calculateAverage = (array) => {
  return array.reduce((a, b) => a + b, 0) / array.length;
};

/**
 * Calculate sum from array of numbers
 * @param {array} array - Array of numbers
 * @returns {number} - Sum value
 */
export const calculateSum = (array) => {
  return array.reduce((a, b) => a + b, 0);
};

/**
 * Get color based on status/value
 * @param {string} status - Status type (success, warning, error, neutral)
 * @returns {string} - Hex color code
 */
export const getStatusColor = (status) => {
  const colorMap = {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    neutral: '#6B7280',
    info: '#3B82F6',
  };
  return colorMap[status] || '#6B7280';
};

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} length - Max length
 * @returns {string} - Truncated string
 */
export const truncateString = (str, length = 20) => {
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

/**
 * Sort array of objects by specified property
 * @param {array} array - Array to sort
 * @param {string} property - Property to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {array} - Sorted array
 */
export const sortByProperty = (array, property, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[property] > b[property] ? 1 : -1;
    }
    return a[property] < b[property] ? 1 : -1;
  });
};

/**
 * Filter array by range of values
 * @param {array} array - Array to filter
 * @param {string} property - Property to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {array} - Filtered array
 */
export const filterByRange = (array, property, min, max) => {
  return array.filter(item => item[property] >= min && item[property] <= max);
};

/**
 * Group array by property value
 * @param {array} array - Array to group
 * @param {string} property - Property to group by
 * @returns {object} - Grouped object
 */
export const groupByProperty = (array, property) => {
  return array.reduce((acc, item) => {
    const key = item[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
};

/**
 * Validate date string
 * @param {string} dateString - Date string to validate
 * @returns {boolean} - True if valid date
 */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Format date to MM/DD/YYYY
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Calculate success rate from successful and total counts
 * @param {number} successful - Successful count
 * @param {number} total - Total count
 * @returns {number} - Success rate percentage
 */
export const calculateSuccessRate = (successful, total) => {
  return total === 0 ? 0 : (successful / total) * 100;
};

/**
 * Get time period label
 * @param {number} days - Number of days
 * @returns {string} - Time period label
 */
export const getTimePeriodLabel = (days) => {
  if (days <= 1) return 'Today';
  if (days <= 7) return 'This Week';
  if (days <= 30) return 'This Month';
  if (days <= 365) return 'This Year';
  return 'All Time';
};

/**
 * Convert snake_case to Title Case
 * @param {string} str - String to convert
 * @returns {string} - Title case string
 */
export const snakeCaseToTitleCase = (str) => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Deep clone object
 * @param {object} obj - Object to clone
 * @returns {object} - Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge multiple objects
 * @param {...objects} objs - Objects to merge
 * @returns {object} - Merged object
 */
export const mergeObjects = (...objs) => {
  return objs.reduce((acc, obj) => ({ ...acc, ...obj }), {});
};

/**
 * Check if value is within array
 * @param {*} value - Value to check
 * @param {array} array - Array to check in
 * @returns {boolean} - True if value in array
 */
export const isInArray = (value, array) => {
  return array.includes(value);
};

/**
 * Remove duplicates from array
 * @param {array} array - Array with potential duplicates
 * @returns {array} - Array without duplicates
 */
export const removeDuplicates = (array) => {
  return [...new Set(array)];
};

export default {
  formatNumber,
  formatPercentage,
  calculatePercentage,
  formatTimeMs,
  calculateAverage,
  calculateSum,
  getStatusColor,
  truncateString,
  sortByProperty,
  filterByRange,
  groupByProperty,
  isValidDate,
  formatDate,
  calculateSuccessRate,
  getTimePeriodLabel,
  snakeCaseToTitleCase,
  deepClone,
  mergeObjects,
  isInArray,
  removeDuplicates,
};
