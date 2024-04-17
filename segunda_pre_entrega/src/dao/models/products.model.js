const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: 100
    },
    description: {
        type: String,
        required: true,
        max: 300
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        max: 200
    },
    code: {
        type: String,
        required: true,
        max: 6,
        unique: true
    },
    stock: {
        type: Number,
        required: true,
        max: 5000
    }
})


module.exports = mongoose.model('product', productSchema, 'products')