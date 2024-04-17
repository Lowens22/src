document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault(); // Prevenir la acción predeterminada del enlace
        const productId = this.dataset.productId; // Obtener el ID del producto del atributo de datos

        // Crear el cuerpo de la solicitud con el productId
        const requestBody = { productId: productId , quantity: 1 };

        // Enviar una solicitud AJAX para agregar el producto al carrito
        $.ajax(`/api/carts/`, {
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(requestBody), // Agregar el cuerpo de la solicitud
            error: function(xhr, status, error) {
                console.error(error); // Manejar errores de la solicitud AJAX
            }
        });
    });
});
