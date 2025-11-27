import React, { useEffect, useState } from "react";
import { ProductInList } from "./ProductInList";
import { ProductShoppingCard } from "./ProductShoppingCard";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const ModalShoppingCart = () => {

    const { dispatch, store } = useGlobalReducer()
    const categories = store.categories || []
    const cartItems = store?.cart || [];
    const [clientData, setClientData] = useState({
        full_name: '',
        address: '',
    });
    const [searchParams, setSearchParams] = useState({
        name: '',
        categoryId: '',
    })
    const [loading, setLoading] = useState(false);

    const calculateTotalAmount = () => {
        return cartItems.reduce((sum, item) => {
            const itemSubtotal = item.quantity * parseFloat(item.product.price);
            return sum + itemSubtotal;
        }, 0);
    };

    const totalAmount = calculateTotalAmount()

    const handleSearchChange = (e) => {
        const { id, value } = e.target;
        setSearchParams(prevParams => ({
            ...prevParams,
            [id]: value,
        }));
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setClientData(prevData => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleOrderSubmit = async () => {

        // 4.1. Validaciones mínimas
        if (!clientData.full_name || !clientData.address) {
            alert("Por favor, complete el nombre y la dirección del cliente.");
            return;
        }

        if (cartItems.length === 0) {
            alert("El carrito está vacío. Agregue productos para crear una orden.");
            return;
        }

        // 4.2. Preparar los ítems de la orden para el backend
        // Solo enviamos los datos necesarios: product_id, quantity y price_at_sale (opcional pero muy recomendado)
        const order_items = cartItems.map(item => ({
            product_id: item.product.id,
            quantity_sold: item.quantity,
            // Guardar el precio de venta en el momento de la orden (importante para contabilidad)
            price_at_sale: parseFloat(item.product.price)
        }));

        // 4.3. Construir el cuerpo de la solicitud POST
        const orderData = {
            client_name: clientData.full_name,
            delivery_address: clientData.address,
            total_amount: totalAmount.toFixed(2),
            order_items: order_items,
            // Puedes añadir más campos como user_id, status, etc.
        };

        setLoading(true);
        console.log("Datos a enviar:", orderData); // Puedes revisar esto en la consola

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, { // Asumo un endpoint /api/orders
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                // 4.4. Éxito: Limpiar el formulario y el carrito
                alert("Orden creada exitosamente. El stock ha sido actualizado.");
                setClientData({ full_name: '', address: '' });
                dispatch({ type: 'CLEAR_CART' }); // Necesitas implementar esta acción en tu reducer
                // Cierra el modal (si usas Bootstrap, puede ser necesario usar JS o data-bs-dismiss en el botón)
            } else {
                const result = await response.json();
                alert(`Error al crear la orden: ${result.msg || 'Error del servidor.'}`);
            }

        } catch (error) {
            console.error("Error al enviar la orden:", error);
            alert("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {

        // 1. Construir la URL con Query Params
        const params = new URLSearchParams();

        if (searchParams.name) {
            // Añade el nombre de búsqueda si no está vacío
            params.append('name', searchParams.name);
        }

        if (searchParams.categoryId) {
            // Añade el ID de categoría si está seleccionado
            params.append('category_id', searchParams.categoryId);
        }

        const queryString = params.toString();

        const url = `${import.meta.env.VITE_BACKEND_URL}/api/products?${queryString}`;
        console.log("Fetching URL:", url); // Verifica la URL en la consola

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Error al cargar productos");
            }
            const data = await response.json();

            // 2. DISPATCH para actualizar la lista de productos del catálogo en el store
            // **ASUMIMOS QUE TIENES UNA ACCIÓN 'SET_CATALOG_PRODUCTS' EN TU REDUCER**
            dispatch({ type: 'SET_CATALOG_PRODUCTS', payload: data.products });

        } catch (error) {
            console.error("Fallo al obtener productos:", error);
            // Manejar el error de carga si es necesario
        }
    }

    useEffect(() => { fetchProducts(); }, [searchParams.name, searchParams.categoryId])

    return (
        <div
            className="modal fade"
            id="shoppingCartModal"
            tabIndex={-1}
            aria-labelledby="shoppingCartModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="d-flex justify-content-center align-items-center gap-3 px-3">
                            <i className="fa-solid fa-receipt fs-2"></i>
                            <h5 className="fs-1 fw-bold m-0" id="exampleModalLabel">
                                Create Order
                            </h5>
                        </div>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    {/* Body del Modal */}
                    <div className="modal-body">
                        {/* Parte izquierda del modal */}
                        <div className="row">
                            <div className="col">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="d-flex justify-content-start align-items-center gap-3 px-3 pt-4">
                                            <i className="fa-regular fa-user fs-3 fw-lighter"></i>
                                            <h5 className="fs-3 fw-bold m-0">Client info</h5>
                                        </div>
                                        {/* Input name */}
                                        <div className="d-flex justify-content-center align-items-start px-3 pt-4 flex-column">
                                            <label htmlFor="full_name" className="fs-5 form-label fw-semibold">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="full_name"
                                                placeholder="Enter full name for new user"
                                                value={clientData.full_name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        {/* input address */}
                                        <div className="d-flex justify-content-center align-items-start px-3 pt-4 flex-column">
                                            <label htmlFor="address" className="fs-5 form-label fw-semibold">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="address"
                                                placeholder="Address facturation"
                                                value={clientData.address}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        {/* Titulo del shopping cart*/}
                                        <div className="d-flex justify-content-start align-items-center gap-3 px-3 pt-5">
                                            <i className="fa-solid fa-cart-arrow-down fs-3"></i>
                                            <h5 className="fs-3 fw-bold m-0">Products in order</h5>
                                        </div>
                                        {/* Productos dentro de la lista */}
                                        <div
                                            className="mt-4 mx-3"
                                            style={{
                                                minHeight: '200px',
                                                padding: '16px',
                                                backgroundColor: 'white',
                                                borderRadius: '12px',
                                                boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
                                            }}
                                        >
                                            {/* Productos en la orden de compra */}
                                            <ProductInList />

                                        </div>
                                        {/* Total de la compra */}
                                        <div className="d-flex justify-content-between align-items-center gap-3 px-3 pt-5">
                                            <div className="d-flex justify-content-between align-items-center gap-3">
                                                <i className="fa-solid fa-dollar-sign fs-3 fw-bold"></i>
                                                <h5 className="fs-3 fw-bold m-0">TOTAL AMOUNT:</h5>
                                            </div>
                                            <p className="fs-3 fw-bold">${totalAmount.toFixed(2)}</p>
                                        </div>

                                    </div>
                                    {/* Parte derecha del modal */}
                                    <div className="col-6">
                                        <div className="d-flex justify-content-start align-items-center gap-3 px-3 pt-4">
                                            <i className="fa-solid fa-magnifying-glass fs-3"></i>
                                            <h5 className="fs-3 fw-bold m-0">Product Catalog</h5>
                                        </div>
                                        <div>
                                            {/* Barra de busqueda */}
                                            <div className="pt-4">
                                                <div className="d-flex justify-content-start align-items-center gap-2">
                                                    <div className="form-group w-50 m-0">
                                                        <input type="text" className="form-control" placeholder="Buscar productos..." id="name" value={searchParams.name} onChange={handleSearchChange} />
                                                    </div>
                                                    <div className="m-0">
                                                        <select className="form-control" id="categoryId" value={searchParams.categoryId} onChange={handleSearchChange}>
                                                            <option value="">Category</option>
                                                            {categories.map((cat) => (
                                                                <option key={cat.id} value={cat.id}>
                                                                    {cat.category_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <button className="btn m-0" onClick={fetchProducts}>
                                                        <i className="fs-6 fas fa-search p-0"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Lista de productos */}
                                            <div className="row g-2 pt-4">
                                                <ProductShoppingCard />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-outline-dark"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-warning"
                            onClick={handleOrderSubmit}
                            disabled={loading || cartItems.length === 0} // Deshabilitar si está cargando o el carrito está vacío
                        >
                            {loading ? 'Enviando...' : 'Send order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}