import db from './Connection.js';
import fs from 'fs';

export default async function createDB() {
    const sql = fs.readFileSync('./database/schema.sql').toString();
    const conn = await db.getConnection();
    await conn.query(sql);
    await conn.end();
}