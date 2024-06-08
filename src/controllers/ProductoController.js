// controllers/productController.js
'use strict';
const express = require('express')
const db = require('../db/db');
const oracledb = require('oracledb');

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

async function crearProducto(req, res) {
    if (!req.body || !req.body.informacionProducto || !req.body.detalleProducto) {
        return res.status(400).send('Estructura de solicitud incorrecta');
    }

    // Extraer los datos del cuerpo de la solicitud
    const { informacionProducto: { id, nombre, descripcion }, detalleProducto: { cantidad, precio }, activo, idTipoGenero, idTipoColor, idTipoCategoriaProducto, idTipoTalla } = req.body;

    // Validar que se hayan proporcionado todos los campos requeridos
    if (!id || !nombre || !descripcion || !cantidad || !precio || !activo || !idTipoGenero || !idTipoColor || !idTipoCategoriaProducto || !idTipoTalla) {
        return res.status(400).send('Faltan campos requeridos');
    }

    let connection;
    try {
        connection = await db.connectToDatabase();

        await connection.execute(
            `INSERT INTO PRODUCTOS VALUES(DETALLES(:id, :nombre, :descripcion), PRECIOS_CANTIDAD(:cantidad, :precio), :activo, :idTipoGenero, :idTipoColor, :idTipoCategoriaProducto, :idTipoTalla)`,
            {
                id: id,
                nombre: nombre,
                descripcion: descripcion,
                cantidad: cantidad,
                precio: precio,
                activo: activo,
                idTipoGenero: idTipoGenero,
                idTipoColor: idTipoColor,
                idTipoCategoriaProducto: idTipoCategoriaProducto,
                idTipoTalla: idTipoTalla
            }
        );
        await connection.commit();
        res.status(201).send('Producto creado correctamente');
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).send('Error al crear producto');
    }
}

async function actualizarProducto(req, res) {
    const { informacionProducto: { id, nombre, descripcion }, detalleProducto: { cantidad, precio }, activo, idTipoGenero, idTipoColor, idTipoCategoriaProducto, idTipoTalla } = req.body;


    if (!id || !nombre || !descripcion || !cantidad || !precio || !activo || !idTipoGenero || !idTipoColor || !idTipoCategoriaProducto || !idTipoTalla) {
        return res.status(400).send('Faltan campos requeridos');
    }

    let connection;
    try {
        connection = await db.connectToDatabase();

        await connection.execute(
            `UPDATE PRODUCTOS 
        SET INFORMACION_PRODUCTO = DETALLES(:id, :nombre, :descripcion),
            DETALLE_PRODUCTO = PRECIOS_CANTIDAD(:cantidad, :precio),
            ACTIVO = :activo,
            ID_TIPO_GENERO = :idTipoGenero,
            ID_TIPO_COLORES_ID = :idTipoColor,
            ID_TIPO_CATEGORIA_PRODUCTOS_ID = :idTipoCategoriaProducto,
            ID_TIPO_TALLAS_ID = :idTipoTalla
        WHERE INFORMACION_PRODUCTO = DETALLES(:id, :nombre, :descripcion)`,
            {
                id: id,
                nombre: nombre,
                descripcion: descripcion,
                cantidad: cantidad,
                precio: precio,
                activo: activo,
                idTipoGenero: idTipoGenero,
                idTipoColor: idTipoColor,
                idTipoCategoriaProducto: idTipoCategoriaProducto,
                idTipoTalla: idTipoTalla
            }
        );

        // Realizar commit de la transacción
        await connection.commit();

        res.status(200).send('Producto actualizado correctamente');
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).send('Error al actualizar producto');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error("Error al cerrar la conexión:", error);
            }
        }
    }
}

async function eliminarProducto(req, res) {
    const { id, nombre, descripcion  } = req.params;

    let connection;
    try {
        connection = await db.connectToDatabase();

        await connection.execute(
            `DELETE FROM PRODUCTOS WHERE INFORMACION_PRODUCTO = DETALLES(:id,:nombre,:descripcion)`,
            {
                id: id,
                nombre: nombre,
                descripcion: descripcion
            }
        );

        await connection.commit();
        res.status(200).send('Producto eliminado correctamente');
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).send('Error al eliminar producto');
    }
}

// async function eliminarProducto(req, res) {
//     const { id, nombre, descripcion} = req.params; // Obtener el ID del parámetro de la URL

//     let connection;
//     try {
//         connection = await db.connectToDatabase();

//         await connection.execute(
//             `DELETE FROM PRODUCTOS WHERE INFORMACION_PRODUCTO = DETALLES(id,nombre,descripcion)`,
//             {
//                 id: id,
//                 nombre: nombre, 
//                 descripcion:descripcion
//             }
//         );

//         await connection.commit(); // Confirmar la transacción
//         res.status(200).send('Producto eliminado correctamente');
//     } catch (error) {
//         console.error("Error al eliminar producto:", error);
//         res.status(500).send('Error al eliminar producto');
//     }
// }

module.exports = {
    listarProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
