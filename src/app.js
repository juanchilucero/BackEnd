const express = require('express');
const ProductManager = require('./productManager'); // no reinvento la rueda, traigo el product manager del otro archivo

const app = express();
const port = 8080; //defino puerto

const manager = new ProductManager('./src/productos.json'); // esto me dio problemas, porque no especificaba la ruta me creaba 2 json

app.get('/products', async (req, res) => {
    try {
        let products = manager.getProducts(); // cargamos los productos del json

        //agregamos la opcion del limit
        if (req.query.limit) {
            const limit = parseInt(req.query.limit); // si por algun motivo no convierto el limit en numero entero no me va la cosa, asi que lo hago
            products = products.slice(0, limit); // cortamos el array para que nos traiga la cantidad que queremos
        }

        res.json(products); //traemos lo solicitado
    } catch (error) {
        res.status(500).json({ error: error.message });//agarramos el error
    }
});

//realizamos logica busqueda por id
app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);// lo mismo de antes, pasamos el valor id como numero entero
        const product = await manager.getProductById(productId);//uso la funcion del productManager para traer por id
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });//de nuevo agarramos error
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);// esto es para asegurarme que el puerto esta corriendo
});
