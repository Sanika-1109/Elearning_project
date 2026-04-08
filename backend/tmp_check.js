const fs = require('fs');
const { getPool } = require('./db.js');
async function run() {
  try {
    const pool = await getPool();
    const res = await pool.request().query("SELECT definition FROM sys.check_constraints WHERE name = 'CK__quiz_atte__score__3A81B327'");
    fs.writeFileSync('tmp_check.json', JSON.stringify(res.recordset));
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
run();
