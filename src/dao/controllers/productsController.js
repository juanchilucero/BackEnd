// src/dao/controllers/productsController.js

import Product from '../models/Products.js';

const productsController = {
  // Obtener todos los productos
  getProducts: async (req, res) => {
    try {
      let products = await Product.find();

      // parametro limit
      if (req.query.limit) {
        const limit = parseInt(req.query.limit);
        products = products.slice(0, limit);
      }

      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos.' });
    }
  },

  // Obtener producto por ID
  getProductById: async (req, res) => {
    try {
      const productId = req.params.pid;
      const product = await Product.findById(productId);

      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el producto.' });
    }
  },

  // Añadir un nuevo producto
  addProduct: async (req, res) => {
    try {
      const { title, description, code, price, status, stock, category, thumbnail } = req.body;

      if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
      }

      const newProduct = new Product({
        title,
        description,
        code,
        price,
        status: status || true,
        stock,
        category,
        thumbnail
      });

      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el producto.' });
    }
  },

  // Actualizar un producto existente
  updateProduct: async (req, res) => {
    try {
      const productId = req.params.pid;

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
      }

      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
  },

  // Eliminar un producto
  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.pid;

      const deletedProduct = await Product.findByIdAndDelete(productId);

      if (!deletedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
      }

      res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
  }
};

export default productsController;
