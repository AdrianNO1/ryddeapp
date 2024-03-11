import sqlite3 from 'sqlite3';
import getData from "../../database/runsql"
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
	const { email, password } = req.body;

	const db = new sqlite3.Database('./database/database.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
			res.status(500).json({ error: 'Failed to connect to the database' });
			return;
		}
	});

	try {
		let sql = `SELECT salt
		FROM (
			SELECT salt, email, password FROM children
			UNION ALL
			SELECT salt, email, password FROM parents
		) AS combined
		WHERE email = ?`
		const salt = await getData(db, sql, [email]);
		if (salt.length === 0) {
			res.status(400).json({ error: 'Invalid email' });
			return;
		}
		const hashedPassword = bcrypt.hashSync(password, salt[0].salt);

		sql = `SELECT token
		FROM (
			SELECT email, password, token FROM children
			UNION ALL
			SELECT email, password, token FROM parents
		) AS combined
		WHERE email = ? AND password = ?`
		
		const token = await getData(db, sql, [email, hashedPassword]);
		if (token.length === 0) {
			res.status(400).json({ error: 'Invalid password' });
			return;
		}
		res.status(200).json({ token: token[0].token });
	} catch (error) {
		res.status(500).json({ error: `Failed to process the request: ${error}` });
	} finally {
		db.close();
	}
}