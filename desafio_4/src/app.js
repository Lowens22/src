//const productsRouter = require('./routes/products.router')
//const cartsRouter = require('./routes/carts.router')
const express = require('express');
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const homeRouter = require('./routes/home.router')
const realTimeProductsRouter= require('./routes/realTimeProducts.router')

const app = express();

// configurar handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

// permitir envío de información mediante formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// setear carpeta public como estática
app.use(express.static(`${__dirname}/../public`))

app.use('/home', homeRouter)
app.use('/realTimeProducts', realTimeProductsRouter)

const httpServer = app.listen(8080, () => {
    console.log('Servidor listo!')
})


// creamos un servidor para WS desde el servidor HTTP que nos da express
const socketServer = new Server(httpServer)
app.set('ws', socketServer)



// escuchamos al evento "cliente conectado"
socketServer.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado`)

    
})
