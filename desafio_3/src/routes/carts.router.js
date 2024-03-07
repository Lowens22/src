const { Router } = require('express')

const router = Router()
const CartsManager = require('../CartsManager');
const ProductManager = require('../ProductManager');

const cartsManager = new CartsManager(`../carts.json`);
const productManager = new ProductManager(`../products.json`);


async function start() {
    await cartsManager.loadFromFile();
    await productManager.loadFromFile();
    // Ahora puedes acceder al array #products
    const productsArray = productManager.getProducts();
    
    // Ahora puedes acceder al array #carts
    const cartsArray = cartsManager.getCarts();
    console.log(cartsArray);

    router.get('/', (req, res) => {
        res.json(cartsArray);
    });
    
        // Con esto puedes acceder por su id
    router.get('/:cid', (req, res) => {
        const objectId = +req.params.cid;
        const carrito = cartsArray.find(u => u.id === objectId);
        
        if(!carrito){
            res.send({ status: 'ERROR', message: 'Producto no encontrado'})
            return
        }
        
        res.json(carrito);
    });

    router.post('/:cid/products/:pid', async (req, res) => {
        const cartId = +req.params.cid;
        const productId = +req.params.pid;
    
        // Verificar si el carrito y el producto existen
        const cartIndex = cartsArray.findIndex(cart => cart.id === cartId);
        const productIndex = productsArray.findIndex(product => product.id === productId);
    
        const cart = cartsManager.getCarts().find(c => c.id === cartId) || { id: cartId, products: [] };

        // Verifica si el producto ya está en el carrito
        const existingProduct = cart.products.find(p => p.id === productId);
    
        if (existingProduct) {
            // Si el producto ya existe, incrementa la cantidad
            existingProduct.quantity++;
        } else {
            // Si el producto no existe, agrégalo al carrito
            cart.products.push({ id: productId, quantity: 1 });
        }
    
        // Guarda el carrito actualizado en el archivo
        await cartsManager.addProduct(cart);
    
        res.json({ message: "Product added to cart successfully", cart });
    });
    
};

start();
module.exports = router