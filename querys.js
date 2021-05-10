'use stric'
const connectMYSQL_DB = require('./lib/db/db-mysql');
const errorHandler = require('./errorHandler');
const { simularCargar, checkUserPass, encrypt } = require('./utils/functions');
const util = require('util');
const { MYSQL_DB_HOST_DEV } = process.env;

let db_mysql;

module.exports = {

    consultarSaldo: async (root, { documento, celular }) => {

        try {

            let cliente = [];

            db_mysql = await connectMYSQL_DB();
            const query = util.promisify(db_mysql.query).bind(db_mysql);

            cliente = await query(`SELECT * FROM Clientes WHERE documento = '${documento}' AND celular = '${celular}'`);

            if (cliente.length == 0) {
                return null;
            }

            if (MYSQL_DB_HOST_DEV && MYSQL_DB_HOST_DEV === 'localhost') {
                await simularCargar();
            }

            return { ...cliente[0] };

        } catch (error) {
            errorHandler(error);
        }

    },

    login: async (root, { email, password }) => {

        let cliente = {};
        let token = {
            cpt: '',
            rest: ''
        };

        try {

            db_mysql = await connectMYSQL_DB();
            const query = util.promisify(db_mysql.query).bind(db_mysql);

            const resultCliente = await query(`SELECT * FROM Clientes WHERE email = '${email}'`);

            cliente = { ...resultCliente[0] };

            if (MYSQL_DB_HOST_DEV && MYSQL_DB_HOST_DEV === 'localhost') {
                await simularCargar();
            }

            if (!cliente) {
                return null;
            } else if (! await checkUserPass(password, cliente['password'])) {
                return null;
            }

            Object.assign(token, encrypt(JSON.stringify({ email, id: cliente['id'] })));

            return token;

        } catch (error) {
            errorHandler(error);
        }
    },

    getClientes: async (root, { }) => {

        let clientes = [];

        try {

            db_mysql = await connectMYSQL_DB();
            const query = util.promisify(db_mysql.query).bind(db_mysql);

            clientes = await query('SELECT * FROM Clientes');

            if (MYSQL_DB_HOST_DEV && MYSQL_DB_HOST_DEV === 'localhost') {
                await simularCargar();
            }

            return clientes;

        } catch (error) {
            errorHandler(error);
        }

    },

    getClienteById: async (root, { id }) => {

        let cliente;

        try {

            db_mysql = await connectMYSQL_DB();
            const query = util.promisify(db_mysql.query).bind(db_mysql);

            cliente = await query(`SELECT * FROM Clientes WHERE id = ${id}`);

            if (MYSQL_DB_HOST_DEV && MYSQL_DB_HOST_DEV === 'localhost') {
                await simularCargar();
            }

            return cliente.length > 0 ? { ...cliente[0] } : null;

        } catch (error) {
            errorHandler(error);
        }

    },

}