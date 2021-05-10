`use stric`
const connectMYSQL_DB = require('./lib/db/db-mysql');
const errorHandler = require('./errorHandler');
const { simularCargar,hashPass } = require('./utils/functions');
const util = require('util');
const { MYSQL_DB_HOST_DEV } = process.env;

let db_mysql;

module.exports = {
    
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

            return Object.assign(newCliente, {id: cliente['insertId']});            

        } catch (error) {
            errorHandler(error);
        }


    }

}