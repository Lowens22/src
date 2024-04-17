const express = require('express');
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')

const DbProductManager = require('./dao/dbManagers/productManager')
const DbCartsManager = require('./dao/dbManagers/cartsManager')

const app = express();

const viewsRouter = require('./routes/views.router')
const productsRouter= require('./routes/products.router')
const cartsRouter= require('./routes/carts.router ')

// configurar handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')


// setear carpeta public como estática
app.use(express.static(`${__dirname}/public`))
app.use(express.json())

app.use('/', viewsRouter)
app.use('/api/addProducts', productsRouter)
app.use('/api/carts',cartsRouter)


const main = async () => {

    await mongoose.connect('mongodb+srv://lorenzosanti:12345@cluster1.vpqnatm.mongodb.net/', {
        dbName: 'ecommerce'
    })

    const productManager = new DbProductManager()
    await productManager.prepare()
    app.set('productManager', productManager)

    const cartsManager = new DbCartsManager()
    app.set('cartsManager', cartsManager)

    app.listen(8080, () => {
        console.log('Servidor listo!')
    })
}

main()
