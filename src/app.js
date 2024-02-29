const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
app.use(express.urlencoded({ extended: true }));

async function startServer() {
    const productManager = new ProductManager('desafio_3.json');
    await productManager.loadFromFile();

    // Ahora puedes acceder al array #products
    const productsArray = productManager.getProducts();
    console.log(productsArray);

    app.get('/products', (req, res) => {
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

    app.get('/products/:pid', (req, res) => {
        const objectId = +req.params.pid;
        const product = productsArray.find(u => u.id === objectId);
        
        if(!product){
            res.send({ status: 'ERROR', message: 'Producto no encontrado'})
            return
        }
        
        res.json(product);
    });

    app.listen(8080, () => {
        console.log('Servidor listo!');
    });
}

startServer();
