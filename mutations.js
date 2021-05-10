`use stric`
const connectMYSQL_DB = require('./lib/db/db-mysql');
const errorHandler = require('./errorHandler');
const { simularCargar, hashPass } = require('./utils/functions');
const util = require('util');
const { MYSQL_DB_HOST_DEV } = process.env;

let db_mysql;

module.exports = {
    
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
                return null;
            }

            cliente = { ...resulCliente[0] };

            cliente['saldo'] += valor;

            await query(`UPDATE Billeteras SET saldo = ? WHERE id = ?`, [cliente['saldo'], cliente['idBilletera']]);

            billetera = await query(`SELECT * FROM Billeteras WHERE id = ${cliente['idBilletera']}`);

            if (MYSQL_DB_HOST_DEV && MYSQL_DB_HOST_DEV === 'localhost') {
                await simularCargar();
            }

            return {...billetera[0]};

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