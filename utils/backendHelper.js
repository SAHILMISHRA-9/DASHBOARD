// Server-side helper utilities for Next.js API routes
// Matches the structure from the previous project

import backendConfig from './backendConfig';

/**
 * Get authentication token from request
 * Checks Authorization header, cookies, or request body
 */
export function getAuthToken(req) {
  // Try Authorization header first
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Try cookies
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  
  // Try request body (for some endpoints)
  if (req.body?.token) {
    return req.body.token;
  }
  
  return null;
}

/**
 * Create headers for backend request with authentication
 */
export function createBackendHeaders(req, additionalHeaders = {}) {
  const token = getAuthToken(req);
  const headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Make authenticated request to backend
 */
export async function fetchFromBackend(endpoint, options = {}) {
  const { method = 'GET', body, headers = {}, ...restOptions } = options;
  
  const baseUrl = backendConfig.baseUrl;
  
  if (!baseUrl) {
    throw new Error('Backend URL not configured. Please set NEXT_PUBLIC_BACKEND_URL or BACKEND_URL in .env.local');
  }
  
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${baseUrl}/${cleanEndpoint}`;
  
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };
  
  const config = {
    method,
    headers: requestHeaders,
    ...restOptions,
  };
  
  if (body && method !== 'GET' && method !== 'HEAD') {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, config);
    
    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        const text = await response.text();
        console.error('Failed to parse JSON response:', text.substring(0, 200));
        throw new Error(`Backend returned invalid JSON. Status: ${response.status}`);
      }
    } else {
      // Response is not JSON (likely HTML error page)
      const text = await response.text();
      console.error('Backend returned non-JSON response:', text.substring(0, 500));
      throw new Error(`Backend returned HTML instead of JSON. Status: ${response.status}`);
    }
    
    return {
      status: response.status,
      data,
      ok: response.ok,
    };
  } catch (error) {
    console.error('Backend API Error:', error.message);
    console.error('Request URL:', url);
    throw error;
  }
}

/**
 * Handle authentication errors
 */
export function handleAuthError(res) {
  return res.status(401).json({ error: 'Unauthorized. Please login again.' });
}
