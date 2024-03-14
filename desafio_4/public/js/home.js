const socket = io(); // conectarse al servidor

// escuchar los mensajes que vienen en distintos canales

socket.on('newProduct', (product) => {
    const container = document.getElementById('productsFeed')

    container.innerHTML +=`
    <div class="product">
        <p class="title">${product.title}</p>
        <p class="description">${product.description}</p>
        <p class="price">${product.price}</p>
        <p class="thumbnail">${product.thumbnail}</p>
        <p class="code">${product.code}</p>
        <p class="stock">${product.stock}</p>
    </div>`

})

socket.on('deleteProduct', (productId) => {
    const productToDelete = document.getElementById(productId);
    if (productToDelete) {
        productToDelete.remove();
    } else {
        console.log(`Producto con ID ${productId} no encontrado en el DOM.`);
    }
});


