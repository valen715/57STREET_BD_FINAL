// db/db.js
'use strict';

const oracledb = require('oracledb');

async function connectToDatabase() {
    try {
        const connection = await oracledb.getConnection({
            user: 'ADMIN_57STREET',
            password: 'STREET',
            connectString: 'localhost:1521/xe'
        });
        console.log('Conexión exitosa a la base de datos Oracle');
        return connection;
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    }
}


module.exports = {
    connectToDatabase,
};
