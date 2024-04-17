const { Router } = require('express')
const router = Router()

// CREATE - Crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const CartsManager = req.app.get('cartsManager')
        console.log('Esto es lo que tiene el body: ', JSON.stringify(req.body));
        await CartsManager.addCart(req.body)

        return res.status(200).json({ success: true })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, err })
    }
})



router.delete('/api/carts/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        // Busca el carrito por su ID
        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        
        // Filtra el producto que se desea eliminar del carrito por su ID
        const updatedProducts = cart.products.filter(product => product.productId.toString() !== pid);
        
        // Actualiza el carrito con la lista de productos actualizada
        cart.products = updatedProducts;
        
        // Guarda los cambios en la base de datos
        await cart.save();

        res.json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/api/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params; // Obtén el ID del carrito desde los parámetros de la URL
        const updateData = req.body; // Obtén los datos de actualización del cuerpo de la solicitud

        // Busca el carrito por su ID y actualiza sus datos
        const updatedCart = await CartModel.findByIdAndUpdate(cid, updateData, { new: true });

        if (!updatedCart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json({ message: 'Carrito actualizado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/api/carts/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params; // Obtiene los IDs del carrito y del producto desde los parámetros de la URL
        const { quantity } = req.body; // Obtiene la nueva cantidad de ejemplares del cuerpo de la solicitud

        // Busca el carrito por su ID y el producto dentro de ese carrito por su ID, y actualiza la cantidad de ejemplares del producto
        const updatedCart = await CartModel.findOneAndUpdate(
            { _id: cid, 'products._id': pid },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({ message: 'Carrito o producto no encontrado' });
        }        res.json({ message: 'Cantidad de ejemplares actualizada en el carrito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;

