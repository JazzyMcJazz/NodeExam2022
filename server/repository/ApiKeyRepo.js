import db from '../database/Connection.js';

async function getApiKeyByUserId(id) {
    const conn = await db.getConnection();
    const keys = await conn.query(`SELECT api FROM apikey WHERE user_id = ?`, id);
    await conn.end();
    return keys.length < 1 ? undefined : keys[0].api;
}

async function getUserIdByKey(key) {
    const conn = await db.getConnection();
    const id = await conn.query(`SELECT user_id FROM apikey WHERE api = ?`, key);
    await conn.end();
    return id[0].user_id;
}

async function saveNewApiKey(id, key) {
    const conn = await db.getConnection();

    if (await getApiKeyByUserId(id))
        await conn.query(`UPDATE apikey SET api = ? WHERE user_id = ?`, [key, id]);
    else
        await conn.query(`INSERT INTO apikey (user_id, api) VALUES (?, ?)`, [id, key]);

    await conn.end();
}

async function deleteApiKey(key) {
    const conn = await db.getConnection();
    await conn.query(`DELETE FROM apikey WHERE api = ?`, key);
    await conn.end();
}

export {
    getApiKeyByUserId,
    saveNewApiKey,
    getUserIdByKey,
    deleteApiKey
}