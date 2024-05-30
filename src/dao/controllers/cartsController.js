import Cart from '../models/Cart.js';
import Product from '../models/Products.js';

const cartsController = {
  // Crear un nuevo carrito
  createCart: async (req, res) => {
    try {
      const newCart = new Cart({ products: [] });
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
      const { quantity = 1 } = req.body;

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
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      const updatedCart = await cart.save();
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
    }
  },

  // Eliminar un producto del carrito
  removeProductFromCart: async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ error: 'El carrito no existe.' });
      }

      cart.products = cart.products.filter(
        (item) => item.productId.toString() !== productId
      );

      const updatedCart = await cart.save();
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto del carrito.' });
    }
  },

// Actualizar el carrito con un arreglo de productos
updateCart: async (req, res) => {
  try {
    const cartId = req.params.cid;
    const { products } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'El carrito no existe.' });
    }

    cart.products = products;

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el carrito.' });
  }
},

// Actualizar la cantidad de un producto en el carrito
updateProductQuantity: async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'El carrito no existe.' });
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity = quantity;
      const updatedCart = await cart.save();
      res.status(200).json(updatedCart);
    } else {
      res.status(404).json({ error: 'El producto no existe en el carrito.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cantidad del producto.' });
  }
},

// Eliminar todos los productos del carrito
clearCart: async (req, res) => {
  try {
    const cartId = req.params.cid;

    const deletedCart = await Cart.findByIdAndDelete(cartId);
    if (!deletedCart) {
      return res.status(404).json({ error: 'El carrito no existe.' });
    }

    res.status(200).json({ message: 'Carrito eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el carrito.' });
  }
}
};

export default cartsController;
