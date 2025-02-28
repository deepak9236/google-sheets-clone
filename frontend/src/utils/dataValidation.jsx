// utils/dataValidation.js

export const dataValidation = {
  // Validate numeric input
  isNumeric: (value) => {
    if (value === '' || value === null || value === undefined) return true;
    return !isNaN(Number(value));
  },
  
  // Validate date input (assuming format MM/DD/YYYY)
  isDate: (value) => {
    if (value === '' || value === null || value === undefined) return true;
    
    // Simple regex for MM/DD/YYYY format
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    
    if (!dateRegex.test(value)) return false;
    
    // Check if it's a valid date (e.g., not 02/31/2023)
    const [month, day, year] = value.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  },
  
  // General data type check
  getDataType: (value) => {
    if (value === '' || value === null || value === undefined) return 'empty';
    
    // Check if it's a number
    if (!isNaN(Number(value))) return 'number';
    
    // Check if it's a date (simple check for MM/DD/YYYY format)
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (dateRegex.test(value)) return 'date';
    
    // Otherwise, treat as text
    return 'text';
  },
  
  // Trim whitespace
  trim: (value) => {
    if (typeof value !== 'string') return value;
    return value.trim();
  },
  
  // Convert to uppercase
  upper: (value) => {
    if (typeof value !== 'string') return value;
    return value.toUpperCase();
  },
  
  // Convert to lowercase
  lower: (value) => {
    if (typeof value !== 'string') return value;
    return value.toLowerCase();
  }
};