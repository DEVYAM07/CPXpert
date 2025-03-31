// Format a date string to a human-readable format
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Truncate text to a specific length with an ellipsis
  export const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Get Codeforces rank color class
  export const getCodeforcesRankColor = (rank: string): string => {
    switch (rank?.toLowerCase()) {
      case 'newbie':
        return 'text-gray-400';
      case 'pupil':
        return 'text-green-500';
      case 'specialist':
        return 'text-cyan-500';
      case 'expert':
        return 'text-blue-500';
      case 'candidate master':
        return 'text-purple-500';
      case 'master':
        return 'text-yellow-500';
      case 'international master':
        return 'text-yellow-600';
      case 'grandmaster':
        return 'text-red-500';
      case 'international grandmaster':
        return 'text-red-600';
      case 'legendary grandmaster':
        return 'text-red-700';
      default:
        return 'text-gray-400';
    }
  };
  
  // Get difficulty level name from rating
  export const getDifficultyName = (rating: number): string => {
    if (rating < 800) return 'Very Easy';
    if (rating < 1200) return 'Easy';
    if (rating < 1600) return 'Medium';
    if (rating < 2000) return 'Hard';
    if (rating < 2400) return 'Very Hard';
    if (rating < 2800) return 'Expert';
    return 'Grandmaster';
  };
  
  // Convert kebab-case or snake_case to Title Case
  export const toTitleCase = (str: string): string => {
    return str
      .replace(/[-_]/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  };
  
  // Parse error message from API response
  export const parseErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    
    if (error?.message) return error.message;
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    return 'An unexpected error occurred';
  };
  
  // Generate random color based on string hash
  export const stringToColor = (str: string): string => {
    if (!str) return '#7C3AED'; // Default purple if string is empty
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };