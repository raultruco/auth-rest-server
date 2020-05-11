import { Router } from 'express';
import { verifyToken } from 'middlewares/auth.middlewares.js';
import { name, version } from '../../package.json';

const routes = Router();

routes.get('/hi', function(req, res) {
  res.status(200).send({ 
    hi: 'I\'m ' + name,
    version: version
  });
});

routes.get('/about/me', [verifyToken], function(req, res) {
  res.status(200).send({ 
    hi: 'I\'m ' + name,
    version: version
  });
});

export default routes;
