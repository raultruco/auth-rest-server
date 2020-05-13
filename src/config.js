export default {
    port: process.env.PORT,
    host: process.env.HOST || 'localhost',
    mongoServer: process.env.MONGO_SERVER,
    mongoPort: process.env.MONGO_PORT,
    mongoDatabase: process.env.MONGO_DATABASE,
    mongoUsername: process.env.MONGO_USERNAME,
    mongoPassword: process.env.MONGO_PASSWORD,
    saltLength: process.env.SALT_LENGTH ? parseInt(process.env.SALT_LENGTH) : 10,
    jwtSecret: process.env.JWT_SECRET || '0123456789',
    jwtExpires: process.env.JWT_EXPIRES ? parseInt(process.env.JWT_EXPIRES) : 86400, // 86400 = 24 hours
    pageLimit: process.env.PAGE_LIMIT ? parseInt(process.env.PAGE_LIMIT) : 50
  };
