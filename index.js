require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON en req.body
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión exitosa a MongoDB Atlas'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error.message));

// Ruta GET /productos: Obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los productos', error: error.message });
  }
});

// Ruta POST /productos: Guardar un nuevo producto
app.post('/productos', async (req, res) => {
  try {
    const { nombre, precio, categoria } = req.body;

    // Bonus: Validación 400 si faltan nombre o precio
    if (!nombre || precio === undefined) {
      return res.status(400).json({ mensaje: 'El nombre y el precio son obligatorios' });
    }

    const nuevoProducto = new Producto({
      nombre,
      precio,
      categoria
    });

    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al guardar el producto', error: error.message });
  }
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});