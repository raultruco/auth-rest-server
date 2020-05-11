export default {
    port: process.env.PORT,
    host: process.env.HOST || 'localhost',
    mongoServer: process.env.MONGO_SERVER,
    mongoPort: process.env.MONGO_PORT,
    mongoDatabase: process.env.MONGO_DATABASE,
    mongoUsername: process.env.MONGO_USERNAME,
    mongoPassword: process.env.MONGO_PASSWORD,
    jwtSecret: process.env.JWT_SECRET || '0123456789',
  };
