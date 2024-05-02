import fs from "fs";
import Cart from "../models/Cart.js";

// Función para leer el archivo JSON que contiene la información del carrito
const readCartFile = () => {
  const cartData = fs.readFileSync("./src/data/cart.json", "utf8");
  return JSON.parse(cartData);
};

// Función para escribir en el archivo JSON del carrito
const writeCartFile = (cart) => {
  fs.writeFileSync("./src/data/cart.json", JSON.stringify(cart, null, 2));
};

// Controlador para las operaciones del carrito
const cartsController = {
  // Ruta POST /api/carts/ para crear un nuevo carrito
  createCart: (req, res) => {
    try {
      const cart = new Cart(); // Crear un nuevo carrito usando el modelo Cart
      writeCartFile(cart); // Escribir el carrito en el archivo JSON
      res.status(201).json(cart); // Devolver el carrito creado como respuesta con el código 201 (Created)
    } catch (error) {
      res.status(500).json({ error: "Error al crear el carrito." });
    }
  },

  // Ruta GET /api/carts/:cid para obtener un carrito por su ID
  getCartById: (req, res) => {
    try {
      const cartId = req.params.cid; // Obtener el ID del carrito de los parámetros de la solicitud
      const cart = readCartFile(); // Leer el carrito desde el archivo JSON
      res.json(cart); // Devolver el carrito como respuesta
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el carrito." });
    }
  },

  // Ruta POST /api/carts/:cid/product/:pid para agregar un producto al carrito
  addProductToCart: (req, res) => {
    try {
      const cartId = req.params.cid; // Obtener el ID del carrito de los parámetros de la solicitud
      const productId = req.params.pid; // Obtener el ID del producto de los parámetros de la solicitud
      const { quantity } = req.body; // Obtener la cantidad del producto del cuerpo de la solicitud

      const cart = readCartFile(); // Leer el carrito desde el archivo JSON
      cart.addProduct(productId, quantity); // Agregar el producto al carrito
      writeCartFile(cart); // Escribir el carrito actualizado en el archivo JSON
      res.status(201).json(cart); // Devolver el carrito actualizado como respuesta con el código 201 (Created)
    } catch (error) {
      res.status(500).json({ error: "Error al agregar el producto al carrito." });
    }
  }
};

export default cartsController;
