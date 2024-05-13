const pg = require("pg");
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "demo",
  password: "11102001",
  port: "5432",
});
db.connect()
  .then(() => {
    console.log("Database connected sucessfully");
  })
  .catch((err) => {
    console.log("Error in fetching the database:", err);
  });

module.exports = db;
