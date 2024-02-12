import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import getData from "../../database/runsql"



export default async function handler(req, res) {
	const db = new sqlite3.Database('./database/database.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
			res.status(500).json({ error: 'Failed to connect to the database' });
			return;
		}
	});

	try {
		const sql = fs.readFileSync(path.join(process.cwd(), 'sql', 'getTasks.sql'), 'utf-8')
		const rows = await getData(db, sql);
		res.status(200).json(rows);
	} catch (error) {
		res.status(500).json({ error: `Failed to process the request: ${error}` });
	} finally {
		db.close();
	}
}
