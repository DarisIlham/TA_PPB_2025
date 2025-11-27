// utils/api.js - PERBAIKI dengan better error handling
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  // Handle body data properly
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const fullUrl = `${API_BASE_URL}/api${endpoint}`;
  
  console.log('🔍 [API DEBUG] Making request to:', fullUrl);
  console.log('🔍 [API DEBUG] Method:', config.method || 'GET');
  console.log('🔍 [API DEBUG] Headers:', config.headers);
  if (config.body) {
    console.log('🔍 [API DEBUG] Body:', JSON.parse(config.body));
  }

  try {
    const response = await fetch(fullUrl, config);

    console.log('🔍 [API DEBUG] Response status:', response.status, response.statusText);

    // Try to get the response text first to see what's coming back
    const responseText = await response.text();
    console.log('🔍 [API DEBUG] Raw response:', responseText);

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.log('🔍 [API DEBUG] Response is not JSON:', responseText);
      responseData = { message: responseText };
    }

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error("Authentication failed");
    }

    if (!response.ok) {
      console.error('🔍 [API DEBUG] API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorData: responseData
      });
      
      const errorMessage = responseData.message || 
                          responseData.error || 
                          responseData.errors?.[0]?.msg ||
                          `API request failed with status ${response.status}`;
      
      throw new Error(errorMessage);
    }

    console.log('🔍 [API DEBUG] Request successful:', responseData);
    return responseData;

  } catch (error) {
    console.error('🔍 [API DEBUG] Fetch Error:', error);
    throw error;
  }
};