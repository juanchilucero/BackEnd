export default class Cart {
  constructor() {
    this.id = generateUniqueId(); // Generar un ID único para el carrito
    this.products = [];
  }

  addProduct(productId, quantity) {
    // Buscar si el producto ya está en el carrito
    const existingProduct = this.products.find((product) => product.productId === productId);

    if (existingProduct) {
      // Si el producto ya está en el carrito, aumentar la cantidad
      existingProduct.quantity += quantity;
    } else {
      // Si el producto no está en el carrito, agregarlo
      this.products.push({ productId, quantity });
    }
  }

  removeProduct(productId) {
    // Filtrar los productos del carrito para eliminar el producto especificado
    this.products = this.products.filter((product) => product.productId !== productId);
  }

  // Otros métodos para actualizar la cantidad de un producto, vaciar el carrito, etc.
}
