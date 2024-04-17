const fs = require('fs').promises;

class ProductManager {
	#products;

	static lastId = 1
	static lastCodes = [];

	constructor(filePath) {
		this.#products = [];
		this.path = filePath; // Inicializar la variable this.path con la ruta proporcionada
	}

    async loadFromFile() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.#products = JSON.parse(data);
            console.log(`Datos cargados desde ${this.path}`);
        } catch (error) {
            console.error('Error al cargar los datos:', error.message);
			console.error('Posición del error:', error.at);
        }
    }

    getProducts() {
        return this.#products;
    }

    async saveToFile() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.#products, null, 2));
            console.log(`Datos guardados en ${this.path}`);
        } catch (error) {
            console.error('Error al guardar los datos:', error);
        }
    }

    async deleteProduct(productId) {
        const index = this.#products.findIndex(product => product.id === productId);

        if (index !== -1) {
            const deletedProduct = this.#products.splice(index, 1)[0];
            console.log(`Producto eliminado correctamente. Detalles del producto eliminado:`);
            console.log(deletedProduct);

            // Guardar los cambios en el archivo después de eliminar el producto
            await this.saveToFile();
        } else {
            console.log(`No se encontró ningún producto con el ID ${productId}.`);
        }
    }

    updateProduct(productId, field, newValue) {
        const productToUpdate = this.#products.find(product => product.id === productId);

        if (productToUpdate) {
            // Actualizar el campo especificado con el nuevo valor
            if (productToUpdate.hasOwnProperty(field)) {
                productToUpdate[field] = newValue;
                console.log(`Producto actualizado correctamente. Nuevo valor para ${field}: ${newValue}`);
                this.saveToFile();
            } else {
                console.log(`El campo ${field} no existe en el producto.`);
            }
        } else {
            console.log(`No se encontró ningún producto con el ID ${productId}.`);
        }
    }

	//creacion de codigo autoincrementable
    async getNewId() {
        if (this.#products.length === 0) {
            // Si no hay productos, comenzar desde el últimoId estático
            return ProductManager.lastId++;
        }

        // Obtener el último ID del archivo
        const lastProductId = this.#products.reduce((maxId, product) => Math.max(maxId, product.id), 0);

        // Incrementar el último ID y devolverlo
        return lastProductId + 1;
    }

	getproduct(){
		if (this.#products.length === 0) {
			console.log("No hay productos cargados.");
		} else {
			console.log("Productos cargados:");
			
			this.#products.forEach(producto => {
				console.log(`
				ID: ${producto.id}
				Título: ${producto.title}
				Descripción: ${producto.description}
				Precio: ${producto.price}
				Thumbnail: ${producto.thumbnail}
				Código: ${producto.code}
				Stock: ${producto.stock}
				--------------------------
				`);
			});
		}
	}

	//Busqueda de producto por Id
	getProductById(compId) {
		const productoEncontrado = this.#products.find(producto => producto.id === compId);
	
		if (productoEncontrado) {
			const detalles = Object.entries(productoEncontrado)
			console.log(`Product: `)
			detalles.forEach(d => console.log(`--> ${d[0]}: ${d[1]}`))
			//console.log(`Producto encontrado: ${JSON.stringify(productoEncontrado)}`);
		} else {
			console.log('Not Found');
		}
	}

    async addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios. No se pudo agregar el producto.");
            return;
        }

        const existingProduct = this.#products.find(product => product.code === code);
        if (existingProduct) {
            console.log(`El código ${code} ya existe. No se puede agregar el producto.`);
            return;
        }

		const newId = await this.getNewId();

        const product = {
            id: newId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.#products.push(product);
        await this.saveToFile();
    }
}

// Test
/*(async () => {
    const productManager = new ProductManager('products.json');

    await productManager.loadFromFile();

    await productManager.addProduct("Producto 1", "Descripción 1", 20.99, "imagen1.jpg", "P001", 50);
    await productManager.addProduct("Producto 2", "Descripción 2", 30.99, "imagen2.jpg", "P002", 30);

    console.log('\n') // salto de línea 
    productManager.getProductById(1);// Intento de buscar un producto con ID 1 (si existe)
    console.log('\n') // salto de línea 
    productManager.getProductById(4);// Intento de buscar un producto con ID 4 (no existe) 
    console.log('\n') // salto de línea
    
    await productManager.deleteProduct(1); // o cualquier otro ID que desees eliminar

    productManager.updateProduct(2, 'price', 20,99);
})();
*/
module.exports = ProductManager;


