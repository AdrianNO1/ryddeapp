import sqlite3 from 'sqlite3';
import fs, { link } from 'fs';
import path from 'path';
import getData, { runQuery } from "../../database/runsql"



export default async function handler(req, res) {
    const { token, code, isChild } = req.body;
	const db = new sqlite3.Database('./database/database.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
			res.status(500).json({ error: 'Failed to connect to the database' });
			return;
		}
	});

	try {
		let sql = `SELECT * FROM linking_codes WHERE code = ${code}`;
		let host_id = await getData(db, sql);
        if (host_id.length == 0) {
            res.status(400).json({ error: `Invalid linking code` });
            return;
        }
		sql = `UPDATE ${isChild ? "children" : "parents"} SET host = ${host_id[0].host} WHERE token = ?`;
		await runQuery(db, sql, [token]);

		res.status(200).json({host_id: host_id});
	} catch (error) {
		res.status(500).json({ error: `Failed to process the request: ${error}` });
	} finally {
		db.close();
	}
}
