// pages/api/auth/login.js
import { proxyToBackend } from "../../../utils/api";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success: false, message: "Method not allowed" });

  try {
    const { phone, password, mobile, role } = req.body;
    
    // Validate required fields
    if (!phone && !mobile) {
      return res.status(400).json({ 
        success: false, 
        message: "Phone number is required" 
      });
    }

    if (!password) {
      return res.status(400).json({ 
        success: false, 
        message: "Password is required" 
      });
    }
    
    // Support both 'phone' and 'mobile' for compatibility
    const phoneNumber = phone || mobile;

    // Proxy to backend
    const result = await proxyToBackend('auth/login', {
      method: 'POST',
      body: { phone: phoneNumber, password },
    });

    if (result.ok && result.data.token) {
      // Backend returns { token } - transform to match frontend expectations
      return res.status(200).json({
        success: true,
        token: result.data.token,
        user: {
          name: result.data.name || 'User',
          role: result.data.role || role,
          phone: result.data.phone || phoneNumber,
        }
      });
    }

    // Handle backend errors
    return res.status(result.status || 401).json({
      success: false,
      message: result.data?.error || result.data?.message || "Invalid credentials"
    });
  } catch (error) {
    console.error("Login error:", error);
    
    // Provide more helpful error messages
    let errorMessage = "Server error";
    if (error.message.includes('Backend returned HTML')) {
      errorMessage = "Backend server error. Please check if the backend is running and the URL is correct.";
    } else if (error.message.includes('not configured')) {
      errorMessage = "Backend URL not configured. Please set BACKEND_URL in .env.local";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}
