import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


export const checkAuth = (req, res, next) => {
  try {
    dotenv.config();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided or invalid format' });
    }
    const token = authHeader.split(' ')[1]; 

    const secretKey = process.env.JWT_SECRET;
     if (!secretKey) {
      throw new Error('Server configuration error: JWT Secret missing'); 
    }

    const decodedToken = jwt.verify(token, secretKey);

    req.userData = { userId: decodedToken._id, email: decodedToken.email };


    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: 'Unauthorized: Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};