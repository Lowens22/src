const { Router } = require('express')

const router = Router()
const ProductManager = require('../ProductManager');
//const { dirname } = require('path');

const productManager = new ProductManager(`../products.json`);

async function startServer() {
    await productManager.loadFromFile();

    // Ahora puedes acceder al array #products
    const productsArray = productManager.getProducts();
    

    router.get('/', (req, res) => {
        const titleFilter = req.query.title;
        const objectByTitle = titleFilter
            ? productsArray.filter(u => u.title === titleFilter)
            : productsArray;

        const descriptionFilter = req.query.description;
        const objectByDescription = descriptionFilter
            ? objectByTitle.filter(u => u.description.startsWith(descriptionFilter))
            : objectByTitle;

        const limit = req.query.limit;
        const limitedResult = limit ? objectByDescription.slice(0, parseInt(limit, 10)) : objectByDescription;
    
        res.json(limitedResult);
    });
    
        // Con esto puedes acceder a un producto por su id
    router.get('/:pid', (req, res) => {
        const objectId = +req.params.pid;
        const product = productsArray.find(u => u.id === objectId);
        
        if(!product){
            res.send({ status: 'ERROR', message: 'Producto no encontrado'})
            return
        }
        
        res.json(product);
    });

    router.post('/', (req, res) => {
        const product = req.body;
        const newId = productManager.getNewId(); 
        product.id = newId;

        productManager.addProduct(product.title, product.description, product.price, product.thumbnail, product.code, product.stock);
        productManager.saveToFile();

        res.status(201).json(product);
    });

    router.delete('/:pid', (req,res) =>{
        const productId = +req.params.pid // nota: los parámetros vienen como strings
        const productIndex = productsArray.findIndex(u => u.id === productId)
    
        if (isNaN(productId)) {
            res.status(400).json({ error: "Invalid ID format" })
            return
        }
        
        if (productIndex < 0) {
            res.status(404).json({ error: "User not found" })
            return
        }
    
        // remover el producto en ese índice del array
        productsArray.splice(productIndex, 1)
            productManager.saveToFile()
        .then(() => {
            // HTTP 200 OK
            res.status(200).json({ message: "Product has been deleted successfully" });
        })
        .catch((error) => {
            // Manejar cualquier error que ocurra al guardar en el archivo
            console.error('Error al guardar en el archivo:', error);
            res.status(500).json({ error: "Internal server error" });
        });
    });

    router.put('/:pid', (req, res) => {
        const productId = +req.params.pid; // nota: los parámetros vienen como strings
        const productIndex = productsArray.findIndex(u => u.id === productId);
    
        if (isNaN(productId)) {
            res.status(400).json({ error: "Invalid ID format" });
            return;
        }
    
        if (productIndex < 0) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

    const newProductData = { ...productsArray[productIndex], ...req.body, id: productId }
    productsArray[productIndex] = newProductData

    productManager.saveToFile()
    // HTTP 200 OK
    res.status(200).json(newProductData)
    
    });
    
};

startServer();
module.exports = router

