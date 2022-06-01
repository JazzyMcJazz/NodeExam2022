import db from '../database/Connection.js';

async function getApiKeysByUserId(id) {
    const conn = await db.getConnection();
    const keys = await conn.query(`SELECT api FROM apikey WHERE user_id = ?`, id);
    await conn.end();

    return keys.map(key => key.api);
}

async function saveNewApiKey(id, key) {
    const conn = await db.getConnection();
    await conn.query(`INSERT INTO apikey (user_id, api) VALUES (?, ?)`, [id, key]);
    await conn.end();
}

export {
    getApiKeysByUserId,
    saveNewApiKey
}