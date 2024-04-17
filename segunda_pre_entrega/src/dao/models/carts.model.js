const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    products: [
        {
            quantity: {
                type: Number,
                required: true,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product' 
            }
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema, 'carts');
