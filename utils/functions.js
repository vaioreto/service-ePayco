const bcrypt = require('bcrypt');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = 'vVHS6sdmpNWjRRIqCc7rdxs01lwHzfr9';
const iv = crypto.randomBytes(16);
const saltRounds = 11;


module.exports = {

    verificarTokenPago:(sessionToken, sessionTokenPago) =>{
        return (sessionToken['email'] !== sessionTokenPago['email'] || sessionToken['id'] !== sessionTokenPago['id']) ? false : true;
    },

    generateTokenPago: (num) => {
        // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const result1 = Math.random().toString(36).substring(0, num).replace('.', '');

        return result1;
    },

    simularCargar: () => {
        return new Promise(resolve => setTimeout(resolve, 3000));
    },

    checkUserPass: async (password, userPass) => {
        return bcrypt.compare(password, userPass);
    },

    hashPass: async (password) => {
        return bcrypt.hash(password, saltRounds);
    },

    encrypt: (text) => {

        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return {
            cpt: iv.toString('hex'),
            rest: encrypted.toString('hex')
        };
    },

    decrypt: (hash) => {

        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.cpt, 'hex'));

        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.rest, 'hex')), decipher.final()]);

        return decrpyted.toString();
    }

}