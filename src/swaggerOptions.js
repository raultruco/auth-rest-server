import { name, version, description, license } from '../package.json'
import config from './config.js';
import mongoose from 'mongoose';
import m2s from 'mongoose-to-swagger';

const schemaComponents = {};
// Build swagger components from mongoose schemas, applying some tweaks
mongoose.modelNames().forEach(modelName => {
    const swaggerModel = m2s(mongoose.model(modelName));
    // Rename "_id" to "id" and move to the top. 
    swaggerModel.properties = Object.assign({id: swaggerModel.properties._id}, swaggerModel.properties);
    delete swaggerModel.properties._id;
    // Remove "password" field from member Model schema (Since it's only handled from auth routes)
    if (modelName === 'Member') {
        delete swaggerModel.properties.password;
    }
    schemaComponents[modelName] = swaggerModel;
});

const parameterComponents = {
    page: {
        in: 'query',
        name: 'page',
        required: false,
        schema: {
            type: 'integer',
            minimum: 1,
            default: 1
        },
        description: 'Page number to retrieve, starting on 1'
    },
    sort: {
        in: 'query',
        name: 'sort',
        required: false,
        schema: {
            type: 'string',
            default: '<none>'
        },
        description: 'Sorting field, optionally preceded with - or + to get descending or ascending results respectively'
    }
}

export default {
    definition: {
        openapi: '3.0.3',
        info: {
            title: name,
            version: version,
            description: description,
            license: {
                name: license
            },
            contact: {
                name: 'Raul Truco',
                url: 'https://github.com/raultruco',
                email: 'raultruco@gmail.com'
            },
        },
        servers: [
            {
                description: 'Local server',
                url: `${config.host}:${config.port}/api0`
            }
        ],
        tags: [
            { name: 'Authentication' },
            { name: 'Members endpoints' }
        ],
        components: {
            schemas: schemaComponents,
            parameters: parameterComponents,
            securitySchemes: {
                accessTokenHeaderAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-access-token'
                },
                accessTokenBearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            { accessTokenHeaderAuth: [] },
            { accessTokenBearerAuth: [] }
        ],
    },
    apis: ['./src/routes/**/*.js']
};
