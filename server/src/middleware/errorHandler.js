import { ENV } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error('[Server Error]', {
    message: err.message,
    stack: ENV.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method
  });

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack })
  });
};
