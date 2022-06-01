import db from '../database/Connection.js';

export async function getVerificationTokenByUser_id(user_id) {
    const conn = await db.getConnection();
    const token = await conn.query('SELECT * FROM verification_token WHERE user_id = ?', [user_id]);
    await conn.end();
    return token[0];
}

export async function checkVerificationToken(user_id, token) {
    const conn = await db.getConnection();
    const isMatch = !!await conn.query('SELECT * FROM verification_token WHERE user_id = ? AND token = ?',
        [user_id, token]
    );
    await conn.end();
    return isMatch;
}

export async function saveNewVerificationToken(user_id, token) {
    const conn = await db.getConnection();
    const existingToken = await getVerificationTokenByUser_id(user_id);

    if (existingToken)
        await conn.query('UPDATE verification_token SET token = ? WHERE user_id = ?', [token, user_id])
    else
        await conn.query('INSERT INTO verification_token (user_id, token) VALUES (?, ?)', [user_id, token]);

    await conn.end();
}

export async function removeVerificationTokenByUser_id(user_id) {
    const conn = await db.getConnection();
    await conn.query('DELETE FROM verification_token WHERE user_id = ?', user_id);
    await conn.end();
}