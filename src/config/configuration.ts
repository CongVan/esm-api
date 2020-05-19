export default () => ({
  port: parseInt(process.env.SEVER_PORT, 10) || 3005,
  database: {
    host: process.env.MONGO_DB_HOST,
    port: parseInt(process.env.MONGO_DB_PORT, 10) || 27017,
    user: process.env.MONGO_DB_USER,
    pass: process.env.MONGO_DB_PASS,
    name: process.env.MONGO_DB_DATABASE
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expired: '30d'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
})
