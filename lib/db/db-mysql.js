'use stric'

const MysqlClient = require('mysql');

const {
    MYSQL_DB_USER_DEV,
    MYSQL_DB_PASSWD_DEV,
    MYSQL_DB_HOST_DEV,
    MYSQL_DB_NAME_DEV
} = process.env;

let connection;


async function mysqlConnectDB() {

    if (connection) return connection;

    let client;

    try {

        client = await MysqlClient.createConnection({
            host: MYSQL_DB_HOST_DEV,
            user: MYSQL_DB_USER_DEV,
            password: MYSQL_DB_PASSWD_DEV,
            database: MYSQL_DB_NAME_DEV
        });

        connection = client;

        return connection;

    } catch (error) {
        console.error('Problemas al conectar con la base de datos', error);
        process.exit(1);
    }

}

module.exports = mysqlConnectDB;