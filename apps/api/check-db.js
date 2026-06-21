const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5434/testdb'
});

async function check() {
  try {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log("TABLES:", res.rows.length);
    res.rows.forEach(r => console.log(r.table_name));
    process.exit(0);
  } catch(e) {
    console.error("DB ERROR:", e);
    process.exit(1);
  }
}
check();
