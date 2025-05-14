const { nanoid } = require('nanoid');
const db = require('../db');

class Url {
    static async create(originalUrl) {
        const shortCode = nanoid(6);
        const { rows } = await db.query(
            'INSERT INTO urls(original_url, short_code) VALUES($1, $2) RETURNING *',
            [originalUrl, shortCode]
        );
        return rows[0];
    }

    static async findByOriginalUrl(originalUrl) {
        const { rows } = await db.query(
            'SELECT * FROM urls WHERE original_url = $1',
            [originalUrl]
        );
        return rows[0]; // если ничего не найдено — будет undefined
    }

    static async findByShortCode(shortCode) {
        const { rows } = await db.query(
            'SELECT * FROM urls WHERE short_code = $1',
            [shortCode]
        );
        return rows[0];
    }
}

module.exports = Url;