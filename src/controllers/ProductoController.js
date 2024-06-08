// controllers/productController.js
'use strict';

const db = require('../db/db');

async function listarProductos(req, res) {
    let connection;
    try {
        connection = await db.connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM PRODUCTOS`
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send('Error al obtener productos');
    } 
}

module.exports = {
    listarProductos,
    // Agregar otras funciones aquí...
};
