import 'dotenv/config';
import mariadb from 'mariadb';

const db = mariadb.createPool({
        host: process.env.DB_HOST,
        database: process.env.DB_SCHEMA,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        multipleStatements: true
    });

export default db;