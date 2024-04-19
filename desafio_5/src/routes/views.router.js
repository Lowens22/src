const { Router } = require('express')

const User = require('../models/user.model')
const { userIsLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth.middleware')



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


router.get('/apicarts', async (req, res) => {
    try {
        const handlebars = require('handlebars');
        const hbs = handlebars.create({ noProtoAccessWarnings: true });
        

        // Poblar los carritos con los productos asociados
        const CartsManager = req.app.get('cartsManager')
        const populatedCarts = await CartsManager.populateCarts();

        // Renderizar la vista 'carts' con los carritos poblados
        res.render('carts', {
            title: 'Carrito',
            carts: populatedCarts, // Pasa los carritos poblados a la vista
            styles: [
                'css.css'
            ],
            scripts: [
                'carts.js'
            ]
        });
    } catch (error) {
        // Manejar errores
        console.error('Error al recuperar y poblar los carritos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/', (req, res) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user)

    res.render('index', {
        title: 'Home',
        isLoggedIn,
        isNotLoggedIn: !isLoggedIn,
    })
})

router.get('/login', userIsNotLoggedIn, (_, res) => {
    res.render('login', {
        title: 'Login'
    })
})

router.get('/register', userIsNotLoggedIn, (_, res) => {
    res.render('register', {
        title: 'Register'
    })
})

router.get('/profile', userIsLoggedIn, async (req, res) => {
    const idFromSession = req.session.user._id

    const user = await User.findOne({ _id: idFromSession })

    res.render('profile', {
        title: 'My profile',
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email
        }
    })
})





module.exports = router
