import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import indexRoute from './routes/index';
import adminRoute from './routes/admin';
import authRoute from './routes/auth';

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});
app.use('/auth', authRoute);
app.use('/admin', adminRoute);
app.use(indexRoute);

// Error
app.use((err, _req, res, _next) => {
  if (err.name === 'UnauthorizedError') {
    return res.sendStatus(401);
  }
  console.error('api route error', err);
  res.sendStatus(err.statusCode || 500);
});

module.exports = {
  path: '/api',
  handler: app
};
