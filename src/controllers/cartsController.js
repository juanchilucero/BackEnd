import fs from "fs";
import Cart from "../models/Cart.js";


const readCartFile = () => {
  const cartData = fs.readFileSync("./src/data/cart.json", "utf8");
  return JSON.parse(cartData);
};


const writeCartFile = (cart) => {
  fs.writeFileSync("./src/data/cart.json", JSON.stringify(cart, null, 2));
};

const generateUniqueId = () => {
  const min = 100;
  const max = 999; 
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const cartsController = {

  createCart: (req, res) => {
    try {
      const cartId = generateUniqueId();
      const cart = new Cart(cartId); // 
      writeCartFile(cart); // 
      res.status(201).json(cart); // 
    } catch (error) {
      res.status(500).json({ error: "Error al crear el carrito." });
    }
  },

  // 
  getCartById: (req, res) => {
    try {
      const cartId = req.params.cid; // 
      const cart = readCartFile(); // 
      res.json(cart); // 
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el carrito." });
    }
  },


  addProductToCart: (req, res) => {
    try {
      const cartId = req.params.cid; // 
      const productId = parseInt(req.params.pid); // 
      
      console.log("Cart ID recibido:", cartId);
      console.log("Product ID recibido:", productId);
      
      const cart = new Cart(cartId); // 
      console.log("Cart creado:", cart);
      
      cart.addProduct(productId); // 
      console.log("Producto agregado al carrito:", productId);
      
      writeCartFile(cart); // 
      console.log("Carrito actualizado:", cart);
      
      res.status(201).json(cart); // 
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Error al agregar el producto al carrito." });
    }
  }
  
  
};

export default cartsController;
