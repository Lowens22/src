const productModel = require('../models/products.model')

class ProductManager {

	constructor() {}

    async prepare() {
        // No hacer nada. 
        // Podríamos chequear que la conexión existe y está funcionando
        if (productModel.db.readyState !== 1) {
            throw new Error('must connect to mongodb!')
        }
    }

    async getAll(filters = {}) {
        try {
            const { title } = { title: null, ...filters };
            const conditions = [];
    
            if (title) {
                conditions.push({
                    title: {
                        $regex: `^${title}`,
                        $options: 'i'
                    }
                });
            }
    
            const query = conditions.length ? { $and: conditions } : {};
    
            const products = await productModel.find(query);
            
            return products.map(u => u.toObject({ virtuals: true }));
        } catch (error) {
            console.error('Error al obtener todos los productos:', error);
            throw error;
        }
    }
    
    async addProduct(product) {
        const { title, description, price, thumbnail, code , stock } = product
        const invalidStock = isNaN(+stock) || +stock < 0
            
        if (!title || !description || !price || invalidStock) {
            throw new Error('invalid product')
        }

        await productModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock: +stock
        })
    }

    async deleteProduct(id) {
        try {
            const result = await productModel.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                throw new Error(`No se encontró ningún producto con el ID: ${id}`);
            }
            console.log(`Producto eliminado correctamente con el ID: ${id}`);
        } catch (error) {
            console.error(`Error al eliminar el producto con el ID: ${id}`, error);
            throw error; // Reenviar el error para que se maneje en un nivel superior
        }
    }
    
}

module.exports = ProductManager


