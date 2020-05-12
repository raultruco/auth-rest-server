import { Router } from 'express';
import memberController from 'controllers/member.controller.js';
import { verifyToken } from 'middlewares/auth.middlewares.js';

const routes = Router();

routes.get(
    '/members/email/:email',
    [ verifyToken ],
    async (req, res) => {
        const { email } = req.params;
        try {
            return res.status(200).send(await memberController.findOneByEmail(email));
        } catch (err) {
            console.error('err: ', err);
            return res.status(err.status || 400).send(err);
        }
    }
);

routes.get(
    '/members/:id',
    [ verifyToken ],
    async (req, res) => {
        const { id } = req.params;
        try {
            return res.status(200).send(await memberController.findOneById(id));
        } catch (err) {
            console.error('err: ', err);
            return res.status(err.status || 400).send(err);
        }
    }
);

routes.get(
    '/members',
    [ verifyToken ],
    async (req, res) => {
        try {
            return res.status(200).send(await memberController.findAll());
        } catch (err) {
            console.error('err: ', err);
            return res.status(err.status || 400).send(err);
        }
    }
);

routes.post(
    '/members',
    [ verifyToken ],
    async (req, res) => {
        try {
            return res.status(200).send(await memberController.create(req.body));
        } catch (err) {
            console.error('err: ', err);
            return res.status(err.status || 400).send(err);
        }
    }
);

routes.put(
    '/members/:id',
    [ verifyToken ],
    async (req, res) => {
        const { id } = req.params;
        try {
            return res.status(200).send(await memberController.update({ id, ...req.body }));
        } catch (err) {
            console.error('err: ', err);
            return res.status(err.status || 400).send(err);
        }
    }
);

routes.delete(
    '/members/:id',
    [ verifyToken ],
    async (req, res) => {
        const { id } = req.params;
        try {
            return res.status(200).send(await memberController.delete(id));
        } catch (err) {
            console.error('err: ', err);
            return res.status(err.status || 400).send(err);
        }
    }
);

routes.delete(
    '/members',
    [ verifyToken ],
    async (req, res) => {
        try {
            return res.status(200).send(await memberController.deleteAll());
        } catch (err) {
            console.error('err: ', err);
            return res.status(err.status || 400).send(err);
        }
    }
);

export default routes;
