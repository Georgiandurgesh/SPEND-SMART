import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token and set user in request object
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      
      // Get user from the token
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token verification failed'
      });
    }
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(500).json({
      success: false,
      error: 'Server error during authentication'
    });
  }
};

export { protect };
