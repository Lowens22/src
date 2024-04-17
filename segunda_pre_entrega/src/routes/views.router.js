const { Router } = require('express')

const router = Router()

router.get('/apiproducts', async (req, res) => {
    try {
        // Obtener el límite de elementos, predeterminado a 10 si no se proporciona
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    
        // Verificar el orden: ascendente por defecto, descendente si se proporciona el parámetro 'sort' con valor 'desc'
        const sort = req.query.sort === 'desc' ? -1 : 1;
    
        // Obtener los filtros de título y descripción de la consulta
        const titleFilter = req.query.title;
        const descriptionFilter = req.query.description;
    
        // Construir la consulta con los filtros de título y descripción
        const filters = {};
        if (titleFilter) {
            filters.title = { $regex: `^${titleFilter}`, $options: 'i' };
        }
        if (descriptionFilter) {
            filters.description = { $regex: `^${descriptionFilter}`, $options: 'i' };
        }
        
        // Obtener los productos aplicando los filtros, límite y orden
        const productManager = req.app.get('productManager')
        const products = await productManager.getAll(filters, limit, sort);
        console.log(products)

        // Si se solicita la página web con '/products', renderizar la plantilla HTML
        res.render('products', {
            title: 'Products Manager',
            products,
            styles: [
                'home.css'
            ],
            scripts: [
                'index.js'
            ]
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});


router.get('/addProducts', async (req, res) => {
    res.render('addProducts', {
        title: 'CRUD Producto',
        styles: [
            'css.css'
        ],
        scripts: [
            'products.js'
        ]
    })
})

router.get('/api/carts', async (req, res) => {
    res.render('carts', {
        title: 'Carrito',
        styles: [
            'css.css'
        ],
        scripts: [
            'carts.js'
        ]
    })
})

module.exports = router
