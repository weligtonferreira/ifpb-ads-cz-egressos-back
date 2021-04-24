// Importações

const { Pool } = require('pg');
const { createClient } = require('redis');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Configurações

dotenv.config();

// ==> Conexões com as bases de dados

// PostgreSQL

const {
    PG_USERNAME,
    PG_PASSWORD,
    PG_HOST,
    PG_PORT,
    PG_NAME
} = process.env;

const pool = new Pool({
    user: PG_USERNAME,
    host: PG_HOST,
    database: PG_NAME,
    password: PG_PASSWORD,
    port: PG_PORT
});

pool.on('connect', () => {
    console.log('PostgreSQL - ON');
});

// Redis

const {
    REDIS_HOST,
    REDIS_PORT
} = process.env;

const redisClient = createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
});

redisClient.on('connect', () => {
    console.log('Redis - ON');
}).on('error', (error) => {
    console.log(error);
});

// MongoDB

const {
    MONGO_HOST,
    MONGO_PORT
} = process.env;

const mongoClient = new MongoClient(`mongodb://${MONGO_HOST}:${MONGO_PORT}`,
    { useUnifiedTopology: true });

// Exportações

module.exports = {
    query: (text, params) => pool.query(text, params),
    redisClient,
    mongoClient
};