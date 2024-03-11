import sqlite3 from 'sqlite3';
import fs, { link } from 'fs';
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
		let sql = `SELECT name, email, pfp, role, datejoined, age, ip FROM parents WHERE host = (SELECT host FROM children WHERE token = ?)`;
		let familyRows = await getData(db, sql, [token]);
		
		sql = `SELECT name, email, pfp, role, datejoined, age, ip FROM children WHERE host = (SELECT host FROM children WHERE token = ?)`;
		familyRows = familyRows.concat(await getData(db, sql, [token]));

		let host_id = await getData(db, `SELECT host FROM children WHERE token = ?`, [token]);
		if (host_id.length == 0) {
			res.status(400).json({ error: `Invalid token` });
			return;
		}
		sql = `SELECT * FROM linking_codes WHERE host = (SELECT host FROM parents WHERE token = ?)`;
		let linkingCodes = await getData(db, sql, [token]);

		const now = new Date();
		linkingCodes = linkingCodes.filter((code) => {
			return new Date(code.expiry_datetime) > now;
		});
		let linkingCode = linkingCodes.length > 0 ? linkingCodes[0].code : null;

		res.status(200).json({family: familyRows, linkingCode: linkingCode, host_id: host_id[0].host});
	} catch (error) {
		res.status(500).json({ error: `Failed to process the request: ${error}` });
	} finally {
		db.close();
	}
}
