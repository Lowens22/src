const { Router } = require('express')
const router = Router()


// CREATE - Crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const productManager = req.app.get('productManager')
        console.log('Esto es lo que tiene el body: ', JSON.stringify(req.body));
        await productManager.addProduct(req.body)

        return res.status(200).json({ success: true })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, err })
    }
})


// DELETE - Eliminar un producto por su ID
router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const productManager = req.app.get('productManager');
        await productManager.deleteProduct(productId);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;

