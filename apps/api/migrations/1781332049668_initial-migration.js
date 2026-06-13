const fs = require("fs");
const path = require("path");

exports.up = async (pgm) => {
  const sql = fs.readFileSync(
    path.join(__dirname, "sql", "schema.sql"),
    "utf8"
  );

  pgm.sql(sql);
};

exports.down = async (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS activity_log CASCADE;
    DROP TABLE IF EXISTS milestone CASCADE;
    DROP TABLE IF EXISTS project CASCADE;
    DROP TABLE IF EXISTS admin CASCADE;
    DROP TABLE IF EXISTS client CASCADE;
    DROP TABLE IF EXISTS key CASCADE;
    DROP TABLE IF EXISTS agency CASCADE;

    DROP TYPE IF EXISTS role CASCADE;
    DROP TYPE IF EXISTS status CASCADE;

    DROP EXTENSION IF EXISTS "uuid-ossp";
  `);
};
