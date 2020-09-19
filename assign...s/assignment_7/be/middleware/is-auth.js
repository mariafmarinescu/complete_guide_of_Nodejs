const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = ( req, res, next ) => {
  const header = req.get('Authorization');
  if (!header) {
    const error = new Error('Without authentication.');
    error.statusCode = 401;
    throw error;
  };
  
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET
    );
  } catch (e) {
    e.statusCode = 500;
    throw e;
  }

  if (!decoded) {
    const error = new Error('Authentication failed.');
    error.statusCode = 401;
    throw error;
  };
  
  req.userId = decoded.userId;
  next();
};
