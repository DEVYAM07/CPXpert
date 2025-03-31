import { QueryClient } from '@tanstack/react-query';
import axios, { AxiosRequestConfig } from 'axios';

// Create a new QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Custom request function that wraps axios
export const apiRequest = async (
  endpoint: string,
  config: AxiosRequestConfig = {}
) => {
  try {
    const response = await axios({
      url: endpoint,
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    return response.data;
  } catch (error: any) {
    // Extract error message from response if available
    const errorMessage = error.response?.data?.message || error.message || 'Request failed';
    
    // Create a custom error object
    const customError = new Error(errorMessage);
    
    // Add status code from response if available
    if (error.response?.status) {
      (customError as any).statusCode = error.response.status;
    }
    
    throw customError;
  }
};

// Default fetcher for react-query that works with our API structure
export const defaultQueryFn = async ({ queryKey }: { queryKey: any }) => {
  // The first element in the queryKey array should be the endpoint
  const endpoint = Array.isArray(queryKey) ? queryKey[0] : queryKey;
  
  return apiRequest(endpoint);
};