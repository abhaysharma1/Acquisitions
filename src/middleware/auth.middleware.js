import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');
    
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token required',
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error', error);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }

    next();
  } catch (error) {
    logger.error('Authorization error', error);
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access denied',
    });
  }
};