import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import getData from "../../database/runsql"



export default async function handler(req, res) {
	const {token, task_id} = req.body;
	const db = new sqlite3.Database('./database/database.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
			res.status(500).json({ error: 'Failed to connect to the database' });
			return;
		}
	});

	try {
		let sql = "SELECT (host) FROM children WHERE token = ?";
		let rows = await getData(db, sql, [token]);
		if (rows.length === 0) {
			sql = "SELECT (host) FROM parents WHERE token = ?";
			rows = await getData(db, sql, [token]);
			if (rows.length === 0){
				res.status(400).json({ error: 'Invalid token' });
				return;
			}
		}

        sql = "SELECT scheduled_tasks.*, children.name, children.id AS child_id FROM scheduled_tasks INNER JOIN children ON children.id = scheduled_tasks.assigned_child WHERE scheduled_tasks.template = ? AND children.host = ?";
        rows = await getData(db, sql, [task_id, rows[0].host]);

		res.status(200).json({children: rows});
	} catch (error) {
		res.status(500).json({ error: `Failed to process the request: ${error}` });
	} finally {
		db.close();
	}
}
