// controllers/productController.js
"use strict";
const express = require("express");
const db = require("../db/db");
const oracledb = require("oracledb");

async function listarProductos(req, res) {
  let connection;
  try {
    connection = await db.connectToDatabase();
    const result = await connection.execute(`SELECT * FROM PRODUCTOS`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
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

async function crearProducto(req, res) {
  if (!req.body) {
    return res.status(400).send("Estructura de solicitud incorrecta");
  }

  // Extraer los datos del cuerpo de la solicitud
  const {
    id, 
    nombre, 
    descripcion ,
    cantidad, 
    precio ,
    activo,
    genero,
    color,
    categoria,
    talla,
  } = req.body;

  // Validar que se hayan proporcionado todos los campos requeridos
  if (
    !id ||
    !nombre ||
    !descripcion ||
    !cantidad ||
    !precio ||
    !activo ||
    !genero ||
    !color ||
    !categoria ||
    !talla
  ) {
    return res.status(400).send("Faltan campos requeridos");
  }

  let connection;
  try {
    connection = await db.connectToDatabase();

    await connection.execute(
      `INSERT INTO PRODUCTOS VALUES(DETALLES(:id, :nombre, :descripcion), PRECIOS_CANTIDAD(:cantidad, :precio), :activo, :genero, :color, :categoria, :talla)`,
      {
        id: id,
        nombre: nombre,
        descripcion: descripcion,
        cantidad: cantidad,
        precio: precio,
        activo: activo,
        genero: genero,
        color: color,
        categoria: categoria,
        talla: talla,
      }
    );
    await connection.commit();
    res.status(201).send("Producto creado correctamente");
  } catch (error) {
    res.status(500).send("Error al crear producto");
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

async function actualizarProducto(req, res) {
  const {
    id, 
    nombre, 
    descripcion,
    cantidad, 
    precio,
    activo,
    genero,
    color,
    categoria,
    talla,
  } = req.body;

  if (
    !id ||
    !nombre ||
    !descripcion ||
    !cantidad ||
    !precio ||
    !activo ||
    !genero ||
    !color ||
    !categoria ||
    !talla
  ) {
    return res.status(400).send("Faltan campos requeridos");
  }

  let connection;
  try {
    connection = await db.connectToDatabase();

    await connection.execute(
      `UPDATE PRODUCTOS p
        SET p.INFORMACION_PRODUCTO = DETALLES(:id, :nombre, :descripcion),
            p.DETALLE_PRODUCTO = PRECIOS_CANTIDAD(:cantidad, :precio),
            p.ACTIVO = :activo,
            p.ID_TIPO_GENERO = :genero,
            p.ID_TIPO_COLORES_ID = :color,
            p.ID_TIPO_CATEGORIA_PRODUCTOS_ID = :categoria,
            p.ID_TIPO_TALLAS_ID = :talla
        WHERE p.INFORMACION_PRODUCTO.id = :id`,
      {
        id: id,
        nombre: nombre,
        descripcion: descripcion,
        cantidad: cantidad,
        precio: precio,
        activo: activo,
        genero: genero,
        color: color,
        categoria: categoria,
        talla: talla,
      }
    );

    await connection.commit();

    res.status(200).send("Producto actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).send("Error al actualizar producto");
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
  const { id, nombre, descripcion } = req.params;

  let connection;
  try {
    connection = await db.connectToDatabase();

    await connection.execute(
      `DELETE FROM PRODUCTOS WHERE INFORMACION_PRODUCTO = DETALLES(:id,:nombre,:descripcion)`,
      {
        id: id,
        nombre: nombre,
        descripcion: descripcion,
      }
    );

    await connection.commit();
    res.status(200).send("Producto eliminado correctamente");
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).send("Error al eliminar producto");
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

module.exports = {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
