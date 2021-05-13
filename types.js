`use stric`
const connectMYSQL_DB = require('./lib/db/db-mysql');
const errorHandler = require('./errorHandler');
const util = require('util');
let db_mysql;

module.exports = {

    Cliente: {
        billetera: async ({ id }) => {

            let billeteraData;

            try {

                db_mysql = await connectMYSQL_DB();
                const query = util.promisify(db_mysql.query).bind(db_mysql);

                billeteraData = id !== undefined
                    ? await query(`SELECT * FROM Billeteras WHERE idCliente = ${id}`)
                    : null;

                return (billeteraData && billeteraData.length > 0) ? { ...billeteraData[0] } : null;

            } catch (error) {
                errorHandler(error);
            }

        },

        pagos: async ({ id }) => {

            let pagosData;

            try {

                db_mysql = await connectMYSQL_DB();
                const query = util.promisify(db_mysql.query).bind(db_mysql);

                pagosData = id !== undefined
                    ? await query(`SELECT * FROM ConfirmarPagos WHERE idCliente = ${id}`)
                    : null;

                return (pagosData != null && pagosData.length > 0) ? pagosData : null;

            } catch (error) {
                errorHandler(error);
            }

        }
    },

    Billetera: {
        cliente: async ({ idCliente }) => {

            let clienteData;

            try {

                db_mysql = await connectMYSQL_DB();
                const query = util.promisify(db_mysql.query).bind(db_mysql);

                clienteData = idCliente !== undefined
                    ? await query(`SELECT * FROM Clientes WHERE id = ${idCliente}`)
                    : null;

                return (clienteData && clienteData.length > 0) ? { ...clienteData[0] } : null;

            } catch (error) {
                errorHandler(error);
            }

        }
    }

}