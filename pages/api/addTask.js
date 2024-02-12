import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import runQuery, {getData} from "../../database/runsql"



export default async function handler(req, res) {
	const db = new sqlite3.Database('./database/database.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
			res.status(500).json({ error: 'Failed to connect to the database' });
			return;
		}
	});
	
	try {
		const { name, task } = req.body;
		const result = await runQuery(db, `INSERT INTO tasks (name, task) VALUES (?, ?)`, [name, task]);
		res.status(200).json({ message: 'Task added', id: result.id });
	} catch (error) {
		res.status(500).json({ error: `Failed to process the request: ${error}` });
	} finally {
		db.close();
	}
}
