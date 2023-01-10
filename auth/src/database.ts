import mysql from "mysql2/promise";

async function connect() {
    const con = await mysql.createConnection({
        host: "mysql",
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });
    return con;
}

export default connect;