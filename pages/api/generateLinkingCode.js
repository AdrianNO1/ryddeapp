import sqlite3 from 'sqlite3';
import fs, { link } from 'fs';
import path from 'path';
import runQuery from "../../database/runsql"



export default async function handler(req, res) {
    const { token } = req.body;
	const db = new sqlite3.Database('./database/database.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
			res.status(500).json({ error: 'Failed to connect to the database' });
			return;
		}
	});

	try {
        const code = Math.floor(100000 + Math.random() * 900000);
		let sql = `INSERT INTO linking_codes (expiry_datetime, code, host) VALUES (datetime('now', '+1 day'), ${code}, (SELECT host FROM parents WHERE token = ?))`;
		await runQuery(db, sql, [token]);

		res.status(200).json({linkingCode: code});
	} catch (error) {
		res.status(500).json({ error: `Failed to process the request: ${error}` });
	} finally {
		db.close();
	}
}
