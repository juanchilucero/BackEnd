// src/dao/controllers/cartsController.js

import Cart from '../models/Cart.js';
import Product from '../models/Products.js';

const cartsController = {
  // Crear un nuevo carrito
  createCart: async (req, res) => {
    try {
      const newCart = new Cart({
        products: []
      });
      const savedCart = await newCart.save();
      res.status(201).json(savedCart);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el carrito.' });
    }
  },

  // Obtener un carrito por ID
  getCartById: async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await Cart.findById(cartId).populate('products.productId');
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado.' });
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el carrito.' });
    }
  },

  // Añadir un producto al carrito
  addProductToCart: async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'El producto no existe.' });
      }

      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ error: 'El carrito no existe.' });
      }

      const existingProductIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity++;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }

      const updatedCart = await cart.save();
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
    }
  }
};

export default cartsController;
