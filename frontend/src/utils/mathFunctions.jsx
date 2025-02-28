// utils/mathFunctions.js

// Helper to convert string values to numbers
const parseNumeric = (values) => {
  return values
    .map(value => {
      // Skip empty values
      if (value === '' || value === null || value === undefined) return null;
      
      // Convert to number
      const num = Number(value);
      return isNaN(num) ? null : num;
    })
    .filter(value => value !== null);
};

export const mathFunctions = {
  // Sum all numeric values in a range
  sum: (values) => {
    const numbers = parseNumeric(values);
    return numbers.reduce((sum, val) => sum + val, 0);
  },
  
  // Calculate average of numeric values
  average: (values) => {
    const numbers = parseNumeric(values);
    if (numbers.length === 0) return 0;
    
    const sum = numbers.reduce((total, val) => total + val, 0);
    return sum / numbers.length;
  },
  
  // Find maximum value
  max: (values) => {
    const numbers = parseNumeric(values);
    if (numbers.length === 0) return 0;
    
    return Math.max(...numbers);
  },
  
  // Find minimum value
  min: (values) => {
    const numbers = parseNumeric(values);
    if (numbers.length === 0) return 0;
    
    return Math.min(...numbers);
  },
  
  // Count numeric values
  count: (values) => {
    const numbers = parseNumeric(values);
    return numbers.length;
  }
};