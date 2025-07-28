import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Get the base URL from environment variable or use relative path
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

// Create a base query with credentials included
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Create a custom base query that handles file downloads
const baseQueryWithFileDownload = async (args, api, extraOptions) => {
  try {
    // If this is a file download, return the raw response
    if (args.responseHandler === 'blob') {
      console.log('Making export request with credentials');
      
      const response = await fetch(`${API_BASE_URL}${args.url}`, {
        method: args.method || 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This will send the cookie
        mode: 'cors', // Explicitly set CORS mode
        cache: 'no-cache', // Prevent caching
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status} error: ${response.statusText}`
        }));
        console.error('Export response error:', error);
        return { error: { status: response.status, data: error } };
      }
      
      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 'transactions.xlsx';
      
      return { data: { blob, filename } };
    }
    
    return await baseQuery(args, api, extraOptions);
  } catch (error) {
    console.error('Export API error:', error);
    return { error: { status: 500, data: { message: 'Failed to export transactions' } } };
  }
};

// Create the API slice
export const exportApiSlice = createApi({
  reducerPath: 'exportApi',
  baseQuery: baseQueryWithFileDownload,
  endpoints: (builder) => ({
    exportTransactions: builder.mutation({
      query: () => ({
        url: '/api/v1/export/transactions',
        method: 'GET',
        responseHandler: 'blob',
      }),
    }),
  }),
});

export const { useExportTransactionsMutation } = exportApiSlice;
