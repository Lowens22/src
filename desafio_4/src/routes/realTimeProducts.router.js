const { Router } = require('express')

const router = Router()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const ProductManager = require('../ProductManager');
const productManager = new ProductManager(`../products.json`);


router.get('/', (_, res) => {
    try{
        res.render('realTimeProducts', {
            useSocketIO: true,
            styles: [
                'css.css'
            ],
            scripts: [
                'realTimeProduct.js'
            ]
        })
    } catch(error){
        console.error(error);
        res.status(500).send('error en el servido')
    }
});

router.post('/',async (req, res) => {
    try{
        console.log(req.body)
        res.json(req.body)

        await productManager.loadFromFile();
        if (req.body.addButton) {
            console.log('Se presionó el botón "Agregar"');
            await productManager.addProduct(
            req.body.title,
            req.body.description,
            +req.body.price,
            req.body.thumbnail,
            req.body.code,
            +req.body.stock
            );
            req.app.get('ws').emit('newProduct', req.body)
        }

        if (req.body.deleteButton) {
            console.log('Se presionó el botón "Eliminar"');
            await productManager.deleteProduct(
                +req.body.productId
            )
            req.app.get('ws').emit('deleteProduct', req.body)
        }


    } catch(error){
        console.error(error);
        res.status(500).send('error en el servidor')
    }
});

module.exports = router