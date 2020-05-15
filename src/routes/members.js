import { Router } from 'express';
import memberController from 'controllers/member.controller.js';
import { verifyToken } from 'middlewares/auth.middlewares.js';
import { processPaginationSorting } from 'middlewares/querystring.middleware.js';
const routes = Router();

/**
 * @swagger
 *
 * /members/email/{email}:
 *   get:
 *     description: Get a member by email
 *     tags: ['Members endpoints']
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Member email
 *         in:  path
 *         required: true
 *         type: string
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

/**
 * @swagger
 *
 * /members/{id}:
 *   get:
 *     description: Get a member by id
 *     tags: ['Members endpoints']
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Member id
 *         in:  path
 *         required: true
 *         type: string
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

/**
 * @swagger
 *
 * /members:
 *   get:
 *     description: Get a list of members
 *     tags: ['Members endpoints']
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/sort'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 *       4xx:
 *         description: Client error
 *       5xx:
 *         description: Server Error 
 */
routes.get(
    '/members',
    [ verifyToken, processPaginationSorting ],
    async (req, res) => {
        try {
            return res.status(200).send(await memberController.findAll(req.paginationSorting));
        } catch (err) {
            console.error('err: ', err);
            return res.status(err.status || 400).send(err);
        }
    }
);
/**
 * @swagger
 *
 * /members:
 *   post:
 *     description: Create a new member
 *     tags: ['Members endpoints']
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Member model data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
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

/**
 * @swagger
 *
 * /members/{id}:
 *   put:
 *     description: Update an existinig member
 *     tags: ['Members endpoints']
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Member id
 *         in:  path
 *         required: true
 *         type: string
 *     requestBody:
 *       description: Member model data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
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

/**
 * @swagger
 *
 * /members/all:
 *   delete:
 *     description: Delete ALL the members
 *     tags: ['Members endpoints']
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       4xx:
 *         description: Client error
 *       5xx:
 *         description: Server Error 
 */
routes.delete(
    '/members/all',
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

/**
 * @swagger
 *
 * /members/{id}:
 *   delete:
 *     description: Delete an existing member
 *     tags: ['Members endpoints']
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: member id
 *         in:  path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       4xx:
 *         description: Client error
 *       5xx:
 *         description: Server Error 
 */
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

export default routes;
