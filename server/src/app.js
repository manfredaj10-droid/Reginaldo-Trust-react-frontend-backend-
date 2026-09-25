import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// HTTP Request Logging
app.use(morgan(ENV.NODE_ENV === 'development' ? 'dev' : 'combined'));

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    if (origin === ENV.CLIENT_ORIGIN) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Central API Router
app.use('/api', apiRouter);

// 404 & Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
