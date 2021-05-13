'use stric'
const connectMYSQL_DB = require('./lib/db/db-mysql');
const connectEmailServer = require('./lib/email-server/email-server');
const errorHandler = require('./errorHandler');
const { simularCargar, checkUserPass, encrypt, generateTokenPago, decrypt } = require('./utils/functions');
const util = require('util');
const { MYSQL_DB_HOST_DEV, EMAIL_USER, EMAIL_SERVICE } = process.env;

let db_mysql;
let email_server;

module.exports = {

    verificar: async (root, { consulta }) => {

        let clientes = [];

        try {

            db_mysql = await connectMYSQL_DB();
            const query = util.promisify(db_mysql.query).bind(db_mysql);

            clientes = await query(`SELECT * FROM Clientes WHERE ${consulta}`);

            if (MYSQL_DB_HOST_DEV && MYSQL_DB_HOST_DEV === 'localhost') {
                await simularCargar();
            }

            return (clientes && clientes.length === 0) ? false : true;

        } catch (error) {
            errorHandler(error);
        }

    },

    pagar: async (root, { sessionToken, monto, descripcion }) => {

        try {

            let cliente = [];
            const userToken = JSON.parse(decrypt(sessionToken));
            const tokenPago = generateTokenPago(7);

            const defaults = {
                sessionToken: JSON.stringify(sessionToken),
                tokenPago: tokenPago,
                createdAt: new Date(),
                monto: monto,
                descripcion: descripcion
            }

            if (EMAIL_SERVICE) {
                email_server = await connectEmailServer();
            }
            
            db_mysql = await connectMYSQL_DB();
            const query = util.promisify(db_mysql.query).bind(db_mysql);

            cliente = await query(`SELECT * FROM Clientes WHERE email = ? AND id = ?`, [userToken['email'], userToken['id']]);

            if (cliente.length == 0) {
                return false;
            }

            if (EMAIL_SERVICE) {

                await email_server.sendMail({
                    from: EMAIL_USER,
                    to: `${userToken['email']}`,
                    subject: "Token de Compra",
                    html: `<b>Token de compra generado para ${descripcion}: ${tokenPago}</b>`,
                });

            }

            await query('INSERT INTO ConfirmarPagos SET ?', Object.assign(defaults, { idCliente: userToken['id'] }));


            return { ...cliente[0] };

        } catch (error) {
            errorHandler(error);
        }

    },

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

            if (resultCliente.length == 0) {
                return null;
            } else if (! await checkUserPass(password, cliente['password'])) {
                return null;
            }

            Object.assign(token, encrypt(JSON.stringify({ nombre: cliente['nombre'], email, id: cliente['id'], celular: cliente['celular'], documento: cliente['documento'] })));

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