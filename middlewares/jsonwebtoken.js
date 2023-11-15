const jwt = require('jsonwebtoken');

const secretKey = 'your-secret-key';
const expiresIn = '1h';

const generateToken = (usuario) => {
    const token = jwt.sign(usuario, secretKey, { expiresIn });
    return token;
}

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token.substring(7), secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
}

module.exports = {
    generateToken,
    authenticateToken,
}