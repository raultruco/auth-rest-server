import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import * as routes from './routes';
import config from './config.js';
import swaggerOptions from './swaggerOptions.js';

const app = express();
app.disable('x-powered-by');

// CORS setup
var corsOptions = {
  origin: `http://${config.host}:${config.port}`
};
app.use(cors(corsOptions));

// Logger
app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// API Routes
app.use('/api0', [
  // passport.initialize(),
  // Framework.Controllers.auth.authenticateApi,
  routes.status,
  routes.auth,
  routes.members,
  ]);

// Swagger docs
app.use('/', swaggerUI.serve);
app.get('/', swaggerUI.setup(swaggerJsDoc(swaggerOptions)));

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
          err: app.get('env') === 'development' ? err.err : null
        }
      });
});

export default app;
