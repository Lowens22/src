const fs = require('fs').promises;

class CartsManager {
	#carts;

	static lastId = 1
	static lastCodes = [];

	constructor(filePath) {
		this.#carts = [];
		this.path = filePath; // Inicializar la variable this.path con la ruta proporcionada
	}

    async loadFromFile() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.#carts = JSON.parse(data);
            console.log(`Datos cargados desde ${this.path}`);
        } catch (error) {
            console.error('Error al cargar los datos:', error.message);
			console.error('Posición del error:', error.at);
        }
    }

    getCarts() {
        return this.#carts;
    }

    async saveToFile() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.#carts, null, 2));
            console.log(`Datos guardados en ${this.path}`);
        } catch (error) {
            console.error('Error al guardar los datos:', error);
        }
    }

	//creacion de codigo autoincrementable
    async getNewId() {
        if (this.#carts.length === 0) {
            // Si no hay productos, comenzar desde el últimoId estático
            return CartsManager.lastId++;
        }

        // Obtener el último ID del archivo
        const lastProductId = this.#carts.reduce((maxId, product) => Math.max(maxId, product.id), 0);

        // Incrementar el último ID y devolverlo
        return lastProductId + 1;
    }

    async addProduct(cart) {
        if (!cart) {
            console.log("No se pudo agregar el carrito.");
            return;
        }

        // Busca el índice del carrito en el array
        const cartIndex = this.#carts.findIndex(c => c.id === cart.id);

        if (cartIndex !== -1) {
            // Si el carrito ya existe, reemplázalo
            this.#carts[cartIndex] = cart;
        } else {
            // Si el carrito no existe, agrégalo al array
            this.#carts.push(cart);
        }

        // Guarda el array de carritos actualizado en el archivo
        await this.saveToFile();
    }
}

module.exports = CartsManager;


