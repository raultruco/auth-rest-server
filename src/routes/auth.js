// JWT Authentication in nodejs express mongodb:
// https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122

// Follow example from Reddit:
// - When you sign up with an existing email, it allows you to reset your username and password
// - It doesn't say you anything that the member is already registered??

import { Router } from 'express';
import { checkExistingMember } from 'middlewares/auth.middlewares.js';
import authController from 'controllers/auth.controller.js';

const routes = Router();

routes.post('/auth/signup', [checkExistingMember], async (req, res) => {
  try {
    const member = await authController.signUp(req.body);
    return res.status(200).send({ member });
  } catch (err) {
    return res.status(err.status || 400).send({ error: err });
  }
});

routes.post('/auth/login', async (req, res) => {
  try {
    const member = await authController.login(req.body);
    return res.status(200).send({ member });
  } catch (err) {
    return res.status(err.status || 400).send({ error: err });
  }
});

export default routes;
