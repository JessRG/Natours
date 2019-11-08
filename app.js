// CommonJS Module System (Node.js)
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

// Start express app
const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com
// app.use(
//   cors({
//     origin: 'https://www.natours.com'
//   })
// );

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files -> defines that all static assets will always automatically be served from a folder called public
app.use(express.static(path.join(__dirname, 'public'))); // built-in middleware function

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // HTTP request middleware logger
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser()); // Parse data from cookie(s)

// Data sanitization against NoSQL query injection (malicious code)
app.use(mongoSanitize());

// Data sanitization against XSS -> Cross-Site Scripting
app.use(xss());

// Prevent parameter pollution Http Parameter Pollution (hpp)
// object of whitelist array of properties that are allowed to be duplicates within a query string
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES

app.use('/', viewRouter); // Mount viewRouter
app.use('/api/v1/tours', tourRouter); // Mount tourRouter
app.use('/api/v1/users', userRouter); // Mount userRouter
app.use('/api/v1/reviews', reviewRouter); // Mount reviewRouter
app.use('/api/v1/bookings', bookingRouter); // Mount bookingRouter

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
