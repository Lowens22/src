const cartModel = require('../models/carts.model')

class CartsManager {

    async addCart(products) {
        const {  productId , quantity } = products
        console.log('Esto es lo que tiene el productId: ', (productId))
        console.log('Esto es lo que tiene el quantity: ', (quantity))
        try {
            await cartModel.create({
                products: [
                    {
                        quantity: quantity,
                        product: productId
                    }
                ]
            });
            console.log("Producto agregado al carrito correctamente");
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            throw error; // Re-lanzar el error para que pueda ser manejado por el código que llama a esta función
        }
    }

    
}
module.exports = CartsManager;


