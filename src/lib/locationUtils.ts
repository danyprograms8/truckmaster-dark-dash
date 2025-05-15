
/**
 * Utility functions for formatting location data
 */

/**
 * Format city and state into a single location string
 * @param city The city name
 * @param state The state code
 * @param abbreviate Whether to abbreviate the location for table display
 * @returns Formatted location string (e.g., "Chicago, IL")
 */
export const formatLocation = (city?: string, state?: string, abbreviate: boolean = true): string => {
  if (!city && !state) return "Not specified";
  if (!city) return `Not specified, ${state}`;
  if (!state) return `${city}, Not specified`;
  
  // Ensure proper capitalization for city names
  const formattedCity = city
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
    
  // If abbreviation is needed, limit the city name length
  if (abbreviate && formattedCity.length > 10) {
    return `${formattedCity.substring(0, 10)}..., ${state.toUpperCase()}`;
  }
  
  return `${formattedCity}, ${state.toUpperCase()}`;
};

/**
 * Format date to MM/DD/YY format (2-digit year)
 * @param dateStr Date string
 * @returns Formatted date string or "TBD" if date is not available
 */
export const formatDateMMDDYY = (dateStr?: string | Date | null): string => {
  if (!dateStr) return "TBD";
  
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  
  return date.toLocaleDateString('en-US', { 
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'  // Use 2-digit year format (YY)
  });
};

/**
 * Format date to MM/DD/YYYY format
 * @param dateStr Date string
 * @returns Formatted date string or "TBD" if date is not available
 */
export const formatDateMMDDYYYY = (dateStr?: string | Date | null): string => {
  if (!dateStr) return "TBD";
  
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString('en-US', { 
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};

/**
 * Format time for display in tooltips
 * @param timeStr Time string in HH:MM format
 * @returns Formatted time string or empty string if time is not available
 */
export const formatTime = (timeStr?: string | null): string => {
  if (!timeStr) return "";
  
  // If the time is already a string in a time format, convert it to standard format
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeStr.toString();
  }
};
