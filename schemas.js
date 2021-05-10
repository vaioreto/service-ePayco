const { readFileSync } = require('fs');
const { join } = require('path');

//Importar aqui todos los schemas ===>> *.graphql

module.exports = {

    typeDefs: readFileSync(
        join(__dirname, './', 'schema.graphql'),
        'utf-8'
    ),

    querysGraphql: readFileSync(
        join(__dirname, './', 'querys.graphql'),
        'utf-8'
    ),

    mutationsGraphql: readFileSync(
        join(__dirname, './', 'mutations.graphql'),
        'utf-8'
    )
}