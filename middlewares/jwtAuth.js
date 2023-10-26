const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Extract the token from the request headers
  const token = req.header('Authorization');

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the token using your secret key
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // If the token is valid, attach the user data to the request for later use
    req.user = user;

    // Continue to the next middleware or route
    next();
  });
}
