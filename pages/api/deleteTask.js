import sqlite3 from 'sqlite3';
import runQuery from "../../database/runsql"
import getData from '../../database/runsql';



export default async function handler(req, res) {
    const { token, id } = req.body;
    
    const db = new sqlite3.Database('./database/database.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
			res.status(500).json({ error: 'Failed to connect to the database' });
			return;
		}
	});

	try {
        let sql = "SELECT host FROM parents WHERE token = ?"
		let host = await getData(db, sql, [token]);
        if (host.length === 0) {
            res.status(400).json({ error: "Invalid token" });
            return;
        }
        // set the deleted_at parameter to the current date
        sql = "UPDATE tasks SET deleted_at = datetime('now') WHERE id = ? AND host = ?";
		await runQuery(db, sql, [id, host[0].host]);

		res.status(200).json({message: "Task created successfully"});
	} catch (error) {
		res.status(500).json({ error: `Failed to process the request: ${error}` });
	} finally {
		db.close();
	}
}
