const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = ( req, res, next ) => {
  let decodedToken;

  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Authentication failed.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  
  try {
    decodedToken = jwt.verify(
      token, 
      process.env.SECRET
    );
  } catch (e) {
    e.statusCode = 500;
    throw e;
  };

  if (!decodedToken) {
    const error = new Error('Authentication failed.');
    error.statusCode = 401;
    throw error;
  };
  
  req.userId = decodedToken.userId;
  next();
};
