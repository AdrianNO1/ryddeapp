import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import getData from "../../database/runsql"



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
		const sql = "SELECT * FROM myTable WHERE token = ? LIMIT 1"
		let rows = await getData(db, sql.replace("myTable", "children"), [token]);
		if (rows.length === 0) {
			rows = await getData(db, sql.replace("myTable", "parents"), [token]);
			if (rows.length === 0) {
				res.status(400).json({ error: 'Invalid token' });
				return;
			}
		}
		res.status(200).json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: `Failed to process the request: ${error}` });
	} finally {
		db.close();
	}
}
