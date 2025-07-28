import jwt from 'jsonwebtoken';

/**
 * Generate HTTP-only cookie with JWT token
 * @param {Object} res - Express response object
 * @param {Object} user - User object
 * @param {number} [statusCode=200] - HTTP status code
 */
const generateCookie = (res, user) => {
  // Generate JWT token
  let token;
  if (typeof user.getSignedJwtToken === 'function') {
    token = user.getSignedJwtToken();
  } else {
    // Fallback if getSignedJwtToken is not available
    token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
  }

  // Cookie options - using maxAge instead of expires for better compatibility
  const options = {
    maxAge: (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000, // 30 days default
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure in production (HTTPS)
    sameSite: 'strict',
  };

  // Set cookie with token and return the token
  res.cookie('token', token, options);
  
  // Return the token so the controller can use it in the response
  return token;
};

export default generateCookie;
