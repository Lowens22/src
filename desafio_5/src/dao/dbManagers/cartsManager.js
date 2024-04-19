
const mongoose = require('mongoose');
const cartModel = require('../../models/carts.model'); // Importa el modelo Cart
const Product = require('../../models/products.model'); // Importa el modelo Product


class CartsManager {

    async addCart(products) {
        const { productId, quantity } = products;

        try {
            // Buscar un carrito existente para el usuario
            let cart = await cartModel.findOne({ user: products.userId });

            // Si no hay un carrito existente, crear uno nuevo
            if (!cart) {
                cart = await cartModel.create({
                    user: products.userId,
                    products: [
                        {
                            quantity: quantity,
                            product: productId
                        }
                    ]
                });
                console.log("Nuevo carrito creado y producto agregado correctamente");
            } else {
                // Verificar si el producto ya existe en el carrito
                const existingProduct = cart.products.find(item => item.product.equals(productId));

                if (existingProduct) {
                    // Si el producto ya está en el carrito, actualizar la cantidad sumando uno
                    existingProduct.quantity += 1;
                } else {
                    // Si el producto no existe en el carrito, agregarlo como nuevo
                    cart.products.push({
                        quantity: quantity,
                        product: productId
                    });
                }

                // Guardar los cambios en el carrito
                await cart.save();
                console.log("Producto agregado al carrito existente correctamente");
            }
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            throw error; // Re-lanzar el error para que pueda ser manejado por el código que llama a esta función
        }
    }


    async populateCarts() {
        try {
            // Obtener todos los carritos de la base de datos
            const carts = await cartModel.find();

            // Poblar los productos en cada carrito
            const populatedCarts = await Promise.all(carts.map(async (cart) => {
                // Poblar los productos en el carrito
                const populatedProducts = await Promise.all(cart.products.map(async (productId) => {
                 // Buscar el producto por su ID y poblarlo
                    const product = await Product.findById(productId).populate('product');
                    return product;
                }));

                // Reemplazar los IDs de productos con los productos poblados en el carrito
                cart.products = populatedProducts;
                return cart;
                console.log('Carritos poblados:', populatedCarts);
            }));

            return populatedCarts;
        } catch (error) {
            console.error('Error al poblar los carritos:', error);
            throw error;
        }
}
}

module.exports = CartsManager;


