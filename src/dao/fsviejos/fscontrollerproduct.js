// productsController.js
//import fs from "fs";
//import Product from "../models/Products.js";


// creamos funcion de lectura
const readProductsFile = () => {
  const productsData = fs.readFileSync("./src/data/productos.json", "utf8");
  return JSON.parse(productsData);
};

// creamos funcion de guardado
const writeProductsFile = (products) => {
  fs.writeFileSync("./src/data/productos.json", JSON.stringify(products, null, 2));
};

// generador de id
const generateUniqueId = () => {
  const randomNumber = Math.floor(10000 + Math.random() * 90000); // generamos numero aleatorio
  return randomNumber; // agarramos 5 digitos
};


const productsController = {
  getProducts: (req, res) => {
    try {
      let products = readProductsFile();
  
      // parametro limit
      if (req.query.limit) {
        const limit = parseInt(req.query.limit);
        products = products.slice(0, limit);
      }
  
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los productos." });
    }
  },

  getProductById: (req, res) => {
    try {
      const productId = parseInt(req.params.pid);//parseamos el valor para que me reconozca el id
      const products = readProductsFile();

      const product = products.find((p) => p.id === productId);//busca el producto

      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: "Producto no encontrado." });//error cuando no existe
      }
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el producto." });//error con archivo
    }
  },

  addProduct: (req, res) => {
    try {
      const { title, description, code, price, status, stock, category, thumbnail } = req.body; //traemos la info del body

      if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
        throw new Error("Todos los campos son obligatorios.");
      }//validamos que tenga todo

      const products = readProductsFile();

      let newProductId;
      do {
        newProductId = generateUniqueId();
      } while (products.some(product => product.id === newProductId)); // verificacion que no se repita id
  

      // crea nuevo producto
      const newProduct = new Product(newProductId, title, description, code, price, status || true, stock, category, thumbnail);

      // agregamos el producto
      products.push(newProduct);

      // guardamos todo en el json
      writeProductsFile(products);

      res.status(201).json(newProduct); // devolvemos producto como respuesta con codigo 201 (Created)
    } catch (error) {
      res.status(500).json({ error: "Error al agregar el producto." });// el error por si las dudas
    }
  },

  updateProduct: (req, res) => {
    try {
      const productId = parseInt(req.params.pid); 

      const products = readProductsFile();

      const productIndex = products.findIndex((p) => p.id === productId);

      if (productIndex !== -1) { 
        // actualizamos el producto con lo proporcionado en el body
        products[productIndex] = {
          ...products[productIndex],
          ...req.body
        };

        // guardamos
        writeProductsFile(products);

        // retornamos producto como respuesta
        res.json(products[productIndex]);
      } else {
        // si no se encuentra error codigo de estado 404 (Not Found)
        res.status(404).json({ error: "Producto no encontrado." });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el producto." });
    }
  },

  deleteProduct: (req, res) => {
    try {
      const productId = parseInt(req.params.pid); 

      let products = readProductsFile();

      // filtro para eliminar el producto
      products = products.filter((p) => p.id !== productId);

      // guardamos
      writeProductsFile(products);

      // retornamos mensaje exitoso
      res.json({ message: "Producto eliminado exitosamente." });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el producto." });
    }
  },

};

export default productsController;