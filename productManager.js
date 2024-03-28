class ProductManager {
    constructor() {
        this.products = []; // creamos la lista vacia
    }

    getProducts() {
        return this.products;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        // validar que todos los campos tengan algo
        if ([title, description, price, thumbnail, code, stock].some(field => field === undefined)) {
            console.error('Todos los campos deben estar definidos.');
            return;
        }

        // verificacion si el codigo ya existe
        const codeExists = this.products.some(product => product.code === code);
        if (codeExists) {
            console.error('El codigo ya existe en otro producto');
            return;
        }

        const id = this.products.length + 1;

        const product = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        // agregar producto
        this.products.push(product);

        return {products: this.products }; // devuelve lista de productos
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error('Producto no encontrado.');
        }
        return product;
    }
}


// pruebas
const manager = new ProductManager();
console.log("------------trae products por primera vez vacio------------");
console.log(manager.getProducts()); // []

// // Debería imprimir el nuevo producto agregado
const newProduct = manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log("------------agregamos productos------------");
console.log(newProduct); 

// mostrar productos
console.log("------------comando mostar productos agregados------------");
console.log(manager.getProducts());

// probando errores
console.log("------------probando error producto repetido------------");
try {
manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
} catch (error) {
  console.error(error.message); // deberia devolver el error
}

// prueba getProductById
console.log("------------prueba getProductById------------");
try {
    console.log(manager.getProductById(1)); // esto deberia imprimir el producto 1
} catch (error) {
    console.error(error.message); // catch de error
}

// prueba getProductById no existente
console.log("------------Prueba getProductById con id no existente------------");
try {
    console.log(manager.getProductById(2)); // se puede reemplazar el id 2 por cualquier id que coloquemos
} catch (error) {
    console.error(error.message); // catch error
}

// por ultimo si corremos node "productManager.js" en la consola nos tira todas las pruebas del codigo