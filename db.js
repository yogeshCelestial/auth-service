const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db.sqlite");

db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
      `);
  db.each("SELECT * FROM users", (err, row) => {
    console.log(row);
  });
});

module.exports = db;
