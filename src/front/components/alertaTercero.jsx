// codigo de creacion exitosa 
Swal.fire({
    title: '¡Éxito!',
    text: 'Producto creado con éxito!',
    icon: 'success',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#667eea'
});
// codigo de Error
Swal.fire({
    title: 'Error!',
    text: 'Error de Conexión al servidor',
    icon: 'error',
    confirmButtonText: 'Cool'
})
// dialogo con tres botones 
Swal.fire({
    title: "Do you want to save the changes?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`
}).then((result) => {
    if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
    } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
    }
});