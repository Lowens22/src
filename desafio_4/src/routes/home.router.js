const { Router } = require('express')

const router = Router()
const ProductManager = require('../ProductManager');
//const { dirname } = require('path');

const productManager = new ProductManager(`../products.json`);

router.get('/', async (_,res) => {
    try{
        await productManager.loadFromFile();
        const product=await productManager.getProducts();

        const productdata = product.map(product =>({
            title: product.title,
            thumbnail: product.thumbnail,
            description: product.description,
            price: product.price,
            stock: product.stock,
            code: product.code
        }));

        res.render('home', {
            product:productdata,
            useSocketIO: true,
            styles: [
                'home.css'
            ],
            scripts: [
                'home.js'
            ]
        })
    } catch(error){
        console.error(error);
        res.status(500).send('error en el servido')
    }
});

module.exports = router
