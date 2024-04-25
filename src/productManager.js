const fs = require('fs'); // por algun motivo tengo que cambiar el package json a commonjs porque sino no me toma el fs

//despues de agregar fs inicializamos el constructor
class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.loadProducts();
    }

    //agregamos la funcion de traer los productos ya existentes en el json
    loadProducts() {
        try {
            const data = fs.readFileSync(this.filePath);
            this.products = JSON.parse(data); // importante parsear los datos que si no no va la cosa
        } catch (error) {
            this.products = []; //agarramos cualquier error y dejamos vacio
        }
    }
    //agregamos funcion para guardar los datos de nuestro array en el json
    saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.filePath, data);
    }

    getProducts() {
        return this.products;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if ([title, description, price, thumbnail, code, stock].some(field => field === undefined)) {
            console.error('Todos los campos deben estar definidos.'); // validamos que todos los campos tengan algo
            return;
        }
    
        const codeExists = this.products.some(product => product.code === code);
        if (codeExists) {
            console.error('El código ya existe en otro producto'); //corroboramos que no se repita el mismo producto
            return;
        }
    
        const id = this.generateId(); // esto lo modificare abajo porque me da problemas con lo agregado recientemente
        const product = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.products.push(product);
        this.saveProducts();
        return product;
    }
    
    //funcion id unico logica: que no se repita el id
    generateId() {
        let maxId = 0;
        for (const product of this.products) {
            if (product.id > maxId) {
                maxId = product.id;
            }
        }
        return maxId + 1; // dependiendo de los id que tenga genero el id con el numero siguiente, lo malo si tengo id 2 y no tengo id 1, igual me crea id 3, pero por ahora soluciono id
    }
    
    // nueva funcion, elimina un producto
    deleteProduct(code) {
        const index = this.products.findIndex(product => product.code === code);
        if (index === -1) {
            console.error('El producto con el código ingresado no existe.'); //agregamos la opcion de que no exista el codigo
            return;
        }
        this.products.splice(index, 1);
        this.saveProducts();
        console.log(`Producto con código ${code} eliminado.`);// proporciona el codigo del producto que eliminamos
    }

    // buscar producto por id
    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error('Producto no encontrado.');
        }
        return product;
    }
}



module.exports = ProductManager
// Ejemplo de uso:
//const manager = new ProductManager('productos.json');

// Agregar productos
//manager.addProduct("Producto 1", "Descripción del producto 1", 100, "thumbnail1.jpg", "ABC123", 10);
//manager.addProduct("Producto 2", "Descripción del producto 2", 200, "thumbnail2.jpg", "DEF456", 20);

// Mostrar productos
//console.log("Productos:", manager.getProducts());

// Eliminar producto
//manager.deleteProduct("ABC123");

// Mostrar productos después de eliminar
//console.log("Productos después de eliminar:", manager.getProducts());

// Limpiar json
// manager.deleteProduct("DEF456");
// si quieren limpiar el json de esta prueba descomentar el de arriba para dejar sin productos, queda pendiente funcion para vaciar el json