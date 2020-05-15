// JWT Authentication in nodejs express mongodb:
// https://medium.com/swlh/jwt-authentication-authorization-in-nodejs-express-mongodb-rest-apis-2019-ad14ec818122

// Follow example from Reddit:
// - When you sign up with an existing email, it allows you to reset your username and password
// - It doesn't say you anything that the member is already registered??

import { Router } from 'express';
const { check, validationResult } = require('express-validator')
import { checkExistingMember } from 'middlewares/auth.middlewares.js';
import authController from 'controllers/auth.controller.js';

const routes = Router();

/**
 * 
 * @swagger
 * /auth/signup:
 *   post:
 *     description: Sign up a new member
 *     tags: ['Authentication']
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: member data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *               fullName:
 *                 type: string
 *                 required: true
 *     security: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       4xx:
 *         description: Client error
 *       5xx:
 *         description: Server Error 
 */
routes.post(
    '/auth/signup',
    [
        checkExistingMember,
        check('email').isEmail(),
        check('password').isLength({ min: 5 })
    ], 
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).send({ message: 'Bad input parameters', errors: errors.array() })
        }
        try {
            const member = await authController.signUp(req.body);
            return res.status(200).send(member);
        } catch (err) {
            return res.status(err.status || 400).send(err);
        }
});

/**
 * @swagger
 * 
 * /auth/login:
 *   post:
 *     description: Login a member supplying his credentials
 *     tags: ['Authentication']
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: member data
 *       content:
 *         'application/json':
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *     security: []
 *     responses:
 *       200:
 *         description: Ok 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: member id
 *                 fullName:
 *                   type: string
 *                   description: member full name
 *                 isAdmin:
 *                   type: boolean
 *                   description: member is an admin
 *                 avatarUrl:
 *                   type: string
 *                   description: member avatar url
 *                 accessToken:
 *                   type: string
 *                   description: authentication access token
 *       4xx:
 *         description: Client error
 *       5xx:
 *         description: Server Error 
 */
routes.post(
    '/auth/login',
    [
        check('email').isEmail(),
        check('password').isLength({ min: 5 })
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).send({ message: 'Bad input parameters', errors: errors.array() })
        }
        try {
            const member = await authController.login(req.body);
            return res.status(200).send(member);
        } catch (err) {
            return res.status(err.status || 400).send(err);
        }
});

export default routes;
