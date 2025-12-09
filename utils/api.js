// Utility to proxy API requests to backend
// Updated to match previous project structure
// Note: Uses NEXT_PUBLIC_BACKEND_URL for compatibility with previous project
function getBackendUrl() {
  // Try NEXT_PUBLIC_BACKEND_URL first (for client-side if needed)
  // Then try BACKEND_URL (for server-side API routes)
  // Fallback to empty string if not set
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 
              process.env.BACKEND_URL || 
              '';
  
  // Remove trailing slash to avoid double slashes
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

/**
 * Proxy API request to backend
 * @param {string} endpoint - Backend endpoint (e.g., 'families/list' or '/families/list')
 * @param {object} options - Request options (method, body, headers, etc.)
 * @returns {Promise<{status: number, data: any, ok: boolean}>}
 */
export async function proxyToBackend(endpoint, options = {}) {
  const { method = 'GET', body, headers = {}, ...restOptions } = options;

  const BACKEND_URL = getBackendUrl();
  
  if (!BACKEND_URL) {
    throw new Error('BACKEND_URL is not configured. Please set NEXT_PUBLIC_BACKEND_URL or BACKEND_URL in .env.local');
  }

  // Remove leading slash if present and ensure no double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${BACKEND_URL}/${cleanEndpoint}`;

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Forward authorization token if present
  if (headers.authorization || headers.Authorization) {
    requestHeaders.Authorization = headers.authorization || headers.Authorization;
  }

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
        // If JSON parsing fails, try to get text for debugging
        const text = await response.text();
        console.error('Failed to parse JSON response:', text.substring(0, 200));
        throw new Error(`Backend returned invalid JSON. Status: ${response.status}`);
      }
    } else {
      // Response is not JSON (likely HTML error page)
      const text = await response.text();
      console.error('Backend returned non-JSON response:', text.substring(0, 500));
      throw new Error(`Backend returned HTML instead of JSON. Status: ${response.status}. This usually means the backend endpoint doesn't exist or there's a server error.`);
    }
    
    return {
      status: response.status,
      data,
      ok: response.ok,
    };
  } catch (error) {
    console.error('Backend API Error:', error.message);
    console.error('Request URL:', url);
    console.error('Request Method:', method);
    if (body) {
      console.error('Request Body:', JSON.stringify(body));
    }
    throw error;
  }
}

/**
 * Extract token from request headers or cookies
 */
export function getTokenFromRequest(req) {
  // Try Authorization header first
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Try cookies as fallback
  if (req.cookies?.auth_token) {
    return req.cookies.auth_token;
  }
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  
  return null;
}

/**
 * Create headers with authorization token
 */
export function createAuthHeaders(req) {
  const token = getTokenFromRequest(req);
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}
