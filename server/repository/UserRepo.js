import bcrypt from 'bcrypt';
import db from "../database/Connection.js";

async function getUserByEmailOrUsername(emailOrUsername) {
    const conn = await db.getConnection();
    let user = await conn.query('SELECT * FROM user WHERE email = ?', [emailOrUsername]);

    if (user[0] === undefined)
        user = await conn.query('SELECT * FROM user WHERE username = ?', [emailOrUsername]);

    if (user[0] !== undefined) delete user[0].password;
    await conn.end();

    return user[0];
}

async function getUserByEmail(email) {
    const conn = await db.getConnection();
    let user = await conn.query('SELECT * FROM user WHERE email = ?', [email]);

    if (user[0] !== undefined) delete user[0].password;

    await conn.end();

    return user[0];
}

async function saveNewUser(user) {
    if (user.password) user.password = await encrypt(user.password); // encrypt password

    const conn = await db.getConnection();

    await conn.query('INSERT INTO user (email, password) VALUES (?, ?)',
        [user.email, user.password]
    );

    const res = await conn.query('SELECT LAST_INSERT_ID()');
    const id = Number.parseInt(res[0]['LAST_INSERT_ID()']);

    await conn.end();

    return id;
}

async function saveUsername(username, id) {
    const conn = await db.getConnection();
    await conn.query(`UPDATE user SET username = ? WHERE id = ?`, [username, id]);
    await conn.end();
}

async function checkUserCredentialsAndReturnUser(user) {
    const conn = await db.getConnection();
    const res = await conn.query('SELECT email, password, enabled FROM user WHERE email = ?', [user.email])
    const userFromDb = res[0];
    await conn.end();

    if (userFromDb)
        if (await bcrypt.compare(user.password, userFromDb.password) && userFromDb.enabled) {
            delete userFromDb.password;
            return userFromDb;
        }
    return false
}

async function verifyUserById(id) {
    const conn = await db.getConnection();
    await conn.query('UPDATE user SET verified = true WHERE id = ?', id);
    await conn.end();
}

// oneliner, but this way the number of salt rounds is constant without using a const
async function encrypt(password) {
    return await bcrypt.hash(password, 12);
}

export {
    getUserByEmailOrUsername,
    getUserByEmail,
    saveNewUser,
    checkUserCredentialsAndReturnUser,
    verifyUserById,
    saveUsername
}