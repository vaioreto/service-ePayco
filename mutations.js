`use stric`
const connectMYSQL_DB = require('./lib/db/db-mysql');
const errorHandler = require('./errorHandler');
const { simularCargar, hashPass, decrypt, verificarTokenPago } = require('./utils/functions');
const util = require('util');
const { MYSQL_DB_HOST_DEV } = process.env;

let db_mysql;

module.exports = {

    confirmarPagos: async (root, { sessionToken, tokenPago, id }) => {

        try {

            let restConfirmarPago = [];
            let restBilletera = [];
            let billeteraData = [];
            let confirmarPagoData = {};
            let cliente ={};
            const userToken = JSON.parse(decrypt(sessionToken));

            const defaults = {
                createdAt: new Date()
            }

            db_mysql = await connectMYSQL_DB();
            const query = util.promisify(db_mysql.query).bind(db_mysql);

            restConfirmarPago = await query(`SELECT * FROM ConfirmarPagos WHERE tokenPago = ? AND id = ?`, [tokenPago, id]);

            if (restConfirmarPago.length == 0) {
                return false;
            }

            confirmarPagoData = { ...restConfirmarPago[0] };

            if( confirmarPagoData['pagado'] ) {
                return false;
            }

            const sessionTokenPago = JSON.parse(decrypt(JSON.parse(confirmarPagoData['sessionToken'])));

            if (!verificarTokenPago(userToken, sessionTokenPago)) {
                return false
            }

            restBilletera = await query(`SELECT * FROM Billeteras WHERE idCliente = ${userToken['id']}`);

            if (restBilletera.length == 0) {
                return false;
            }

            billeteraData = { ...restBilletera[0] };

            await query(`UPDATE Billeteras SET saldo = ? WHERE idCliente = ?`, [(billeteraData['saldo'] -= confirmarPagoData['monto']), userToken['id']]);

            await query(`UPDATE ConfirmarPagos SET pagado = ? WHERE tokenPago = ?`, [true, tokenPago]);
            
            const restCliente = await query(`SELECT * FROM Clientes WHERE id = ?`, [userToken['id']]);

            if (MYSQL_DB_HOST_DEV && MYSQL_DB_HOST_DEV === 'localhost') {
                await simularCargar();
            }

            cliente = {...restCliente[0]};

            return cliente;

        } catch (error) {
            errorHandler(error);
        }

    },

    recargarBilletera: async (root, { documento, celular, valor }) => {

        try {

            const defaults = {
                updatedAt: new Date()
            }

            let cliente;
            let billetera;

            db_mysql = await connectMYSQL_DB();
            const query = util.promisify(db_mysql.query).bind(db_mysql);

            const resulCliente = await query(`SELECT Billeteras.id as idBilletera, 
            Clientes.id as idCliente, saldo FROM Clientes 
            INNER JOIN Billeteras ON Clientes.id = Billeteras.idCliente 
            WHERE Clientes.documento = '${documento}' AND Clientes.celular = '${celular}'`);

            if (resulCliente.length == 0) {
                return false;
            }

            cliente = { ...resulCliente[0] };

            cliente['saldo'] += valor;

            await query(`UPDATE Billeteras SET saldo = ? WHERE id = ?`, [cliente['saldo'], cliente['idBilletera']]);

            billetera = await query(`SELECT * FROM Billeteras WHERE id = ${cliente['idBilletera']}`);

            if (MYSQL_DB_HOST_DEV && MYSQL_DB_HOST_DEV === 'localhost') {
                await simularCargar();
            }

            return { ...billetera[0] };

        } catch (error) {
            errorHandler(error);
        }

    },

    createCliente: async (root, { input }) => {

        try {

            const defaults = {
                password: await hashPass(input['password']),
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: false
            }

            let cliente;
            const newCliente = Object.assign(input, defaults);

            db_mysql = await connectMYSQL_DB();
            const query = util.promisify(db_mysql.query).bind(db_mysql);

            cliente = await query('INSERT INTO Clientes SET ?', newCliente);

            await query('INSERT INTO Billeteras SET ?', {
                idCliente: cliente['insertId'],
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: false
            });

            if (MYSQL_DB_HOST_DEV && MYSQL_DB_HOST_DEV === 'localhost') {
                await simularCargar();
            }

            return Object.assign(newCliente, { id: cliente['insertId'] });

        } catch (error) {
            errorHandler(error);
        }

    }

}