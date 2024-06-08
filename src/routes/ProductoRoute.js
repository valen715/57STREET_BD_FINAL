// routes/productRoutes.js
'use strict';

const express = require('express');
const productController = require('../controllers/ProductoController');

var api = express.Router();

// Definir la ruta para listar productos
api.get('/listarProductos', productController.listarProductos);

// Exportar el router para que pueda ser utilizado en el servidor
module.exports = api;
