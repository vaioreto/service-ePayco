"use strict";
const nodemailer = require("nodemailer");

const {
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_PORT,
    EMAIL_HOST
} = process.env;

let connection;

async function emailServerConnect() {

    if (connection) return connection;

    let transporter;

    try {

        transporter = nodemailer.createTransport({
            host: EMAIL_HOST,
            port: EMAIL_PORT,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD
            }
        })

        connection = transporter;

        return connection;

    } catch (error) {
        console.error('Problemas al conectar email server', error);
        process.exit(1);
    }

}

module.exports = emailServerConnect;