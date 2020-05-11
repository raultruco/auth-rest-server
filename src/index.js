import app from './app';
import { connectDb } from './models';
import config from './config.js';

process.on('warning', e => console.warn(e.stack));
process.on('error', e => console.error(e.stack));

connectDb()
    .then(async () => {
        console.log("Successfully connect to db...");
        app.listen(config.port, () =>
            console.info(`Listening on port ${config.port}...`), // eslint-disable-line no-console
        )
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });
