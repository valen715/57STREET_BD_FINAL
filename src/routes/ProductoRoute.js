// routes/productRoutes.js
'use strict';

const express = require('express');
const productController = require('../controllers/ProductoController');

var api = express.Router();

// Definir la ruta para listar productos
api.get('/listarProductos', productController.listarProductos);
api.post('/crearProducto', productController.crearProducto);
api.put('/actualizarProducto/:id', productController.actualizarProducto);
api.delete('/eliminarProducto/:id', productController.eliminarProducto);

// Exportar el router para que pueda ser utilizado en el servidor
module.exports = api;
