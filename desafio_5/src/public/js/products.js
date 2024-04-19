
$('#productForm').submit(function (e) {
    e.preventDefault();

    const formValues = $(this).serializeArray();

    const requestBody = Object.fromEntries(
        formValues.map(fv => [fv.name, fv.value]) 
    );

    $.ajax(`/api/addProducts`, {
        dataType: 'json',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestBody),
        success: function () {
            window.location = '/addProducts'
        }
    })
});

$('#deleteProductForm').submit(function (e) {
    e.preventDefault();

    const formValues = $(this).serializeArray();

    const requestBody = Object.fromEntries(
        formValues.map(fv => [fv.name, fv.value]) 
    );

    $.ajax(`/api/addProducts/${requestBody.id}`, { // Asegúrate de tener la ruta correcta que maneje la eliminación
        dataType: 'json',
        method: 'DELETE', // Cambia el método a DELETE
        contentType: 'application/json',
        success: function () {
            window.location = '/api/addProducts'; // Redirige a la página de productos después de eliminar
        }
    });
});


