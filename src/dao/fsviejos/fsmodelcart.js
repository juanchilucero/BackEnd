

import fs from "fs";

class Cart {
  constructor(id) {
    this.id = id;
    this.products = [];
  }

  addProduct(productId) {

    const productsData = fs.readFileSync("./src/data/productos.json", "utf8");
    const products = JSON.parse(productsData);
    

    const product = products.find((p) => p.id === productId);
  
    if (!product) {
      throw new Error("El producto no existe.");
    }
    

    const existingProductIndex = this.products.findIndex(
      (item) => item.productId === productId
    );
  
    if (existingProductIndex !== -1) {

      this.products[existingProductIndex].quantity++;
      console.log("La cantidad del producto existente se incrementó:", this.products[existingProductIndex].quantity);
    } else {

      this.products.push({
        productId: productId,
        quantity: 1
      });
      console.log("Producto agregado al carrito con cantidad 1");
    }
  }
  
  
}

export default Cart;