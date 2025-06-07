import 'express-async-errors';
import { corsOptions, env } from '@/config';
import morgan from '@/config/morgan';
import { errorConverter, errorHandler } from '@/middlewares/error';
import { authLimiter } from '@/middlewares/rate-limiter';
import routes from '@/routes';
import { ApiError } from '@/utils';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import httpStatus from 'http-status';

const app = express();

if (env.mode !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors(corsOptions));

// limit repeated failed requests to auth endpoints
if (env.mode === 'production') {
  app.use('/v1/auth', authLimiter);
}

// root route
app.get('/', (_, res) => {
  res.status(200).json({ status: 'OK' });
});

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'No endpoint found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

app.use(errorHandler);

export default app;
