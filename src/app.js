import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as routes from './routes';
import config from './config.js';

const app = express();
app.disable('x-powered-by');

// CORS setup
var corsOptions = {
  origin: `http://${config.host}:${config.port}`
};
app.use(cors(corsOptions));

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// Logger
app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api0', [
  // passport.initialize(),
  // Framework.Controllers.auth.authenticateApi,
  routes.status,
  routes.auth
  ]);

// Web UI routes
// app.use('/', [
//   express.static(path.join(__dirname, '/public')),
//   // favicon(__dirname + '/public/assets/images/favicon.ico'),
//   // Framework.Controllers.auth.authenticateWeb,
//   staticRoutes
//   ]);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
      .status(err.status || 500)
      .send({
        error: {
          status: err.status,
          message: err.message,
        }
      });
});

export default app;
