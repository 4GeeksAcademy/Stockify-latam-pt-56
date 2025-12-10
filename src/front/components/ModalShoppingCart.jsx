import React, { useEffect, useState } from "react";
import { ProductInList } from "./ProductInList";
import { ProductShoppingCard } from "./ProductShoppingCard";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Swal from 'sweetalert2';

export const ModalShoppingCart = () => {
    const { dispatch, store } = useGlobalReducer()
    const categories = store.categories || []
    const cartItems = store?.cart || [];
    const token = store.token
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
        // Validaciones con SweetAlert
        if (!clientData.full_name || !clientData.address) {
            await Swal.fire({
                title: 'Campos Incompletos',
                text: 'Por favor, complete el nombre y la dirección del cliente.',
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#f59e0b'
            });
            return;
        }

        if (cartItems.length === 0) {
            await Swal.fire({
                title: 'Carrito Vacío',
                text: 'El carrito está vacío. Agregue productos para crear una orden.',
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#f59e0b'
            });
            return;
        }

        if (!store.token) {
            await Swal.fire({
                title: 'No Autenticado',
                text: 'No está autenticado. Por favor inicie sesión.',
                icon: 'error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        // Preparar los items de la orden
        const order_items = cartItems.map(item => ({
            product_id: item.product.id,
            quantity_sold: item.quantity,
            price_at_sale: parseFloat(item.product.price)
        }));

        const orderData = {
            client_name: clientData.full_name,
            delivery_address: clientData.address,
            total_amount: totalAmount.toFixed(2),
            order_items: order_items,
        };

        setLoading(true);

        try {
            console.log("Enviando orden...", orderData);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${store.token}`
                },
                body: JSON.stringify(orderData),
            });

            console.log("Respuesta del servidor:", response);

            if (response.ok) {
                //  ORDEN CREADA
                await Swal.fire({
                    title: '¡Orden Creada Exitosamente!',
                    html: `
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; color: #10b981; margin: 10px 0;">
                                ✅
                            </div>
                            <p>La orden ha sido creada y el stock actualizado</p>
                            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0;">
                                <strong>Cliente: ${clientData.full_name}</strong><br/>
                                <small style="color: #6b7280;">Total: $${totalAmount.toFixed(2)}</small>
                            </div>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                    confirmButtonColor: '#10b981'
                });

                // Limpiar formulario y carrito
                setClientData({ full_name: '', address: '' });
                dispatch({ type: 'CLEAR_CART' });

                // Cerrar el modal
                const modal = document.getElementById('shoppingCartModal');
                if (modal) {
                    const bootstrapModal = bootstrap.Modal.getInstance(modal);
                    bootstrapModal.hide();
                }

            } else {
                const result = await response.json();
                console.error("Error del servidor:", result);

                // ERROR ESPECÍFICO DEL SERVIDOR
                await Swal.fire({
                    title: 'Error al Crear Orden',
                    html: `
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin: 10px 0;">😕</div>
                            <p>${result.msg || 'Error del servidor al procesar la orden'}</p>
                            <small style="color: #6b7280;">
                                ${result.msg && result.msg.includes('stock') ? 'Verifica el stock disponible' : ''}
                                ${result.msg && result.msg.includes('token') ? 'Token inválido o expirado' : ''}
                            </small>
                        </div>
                    `,
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#ef4444'
                });
            }

        } catch (error) {
            console.error("Error completo al enviar la orden:", error);

            //  ERROR DE CONEXIÓN DETALLADO
            await Swal.fire({
                title: 'Error de Conexión',
                html: `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin: 10px 0;">📡</div>
                        <p>No se pudo conectar con el servidor</p>
                        <div style="background: #fef2f2; padding: 10px; border-radius: 6px; margin: 10px 0;">
                            <small style="color: #dc2626;">
                                Detalles: ${error.message}
                            </small>
                        </div>
                        <small style="color: #6b7280;">
                            Verifica tu conexión a internet y vuelve a intentar
                        </small>
                    </div>
                `,
                icon: 'error',
                confirmButtonText: 'Reintentar',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        const params = new URLSearchParams();

        if (searchParams.name) {
            params.append('name', searchParams.name);
        }

        if (searchParams.categoryId) {
            params.append('category_id', searchParams.categoryId);
        }

        const queryString = params.toString();
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/products?${queryString}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Error al cargar productos");
            }
            const data = await response.json();
            dispatch({ type: 'SET_CATALOG_PRODUCTS', payload: data.products });
        } catch (error) {
            console.error("Fallo al obtener productos:", error);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [searchParams.name, searchParams.categoryId])

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
                                                disabled={loading}
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
                                                disabled={loading}
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
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Buscar productos..."
                                                            id="name"
                                                            value={searchParams.name}
                                                            onChange={handleSearchChange}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="m-0">
                                                        <select
                                                            className="form-control"
                                                            id="categoryId"
                                                            value={searchParams.categoryId}
                                                            onChange={handleSearchChange}
                                                            disabled={loading}
                                                        >
                                                            <option value="">Category</option>
                                                            {categories.map((cat) => (
                                                                <option key={cat.id} value={cat.id}>
                                                                    {cat.category_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <button
                                                        className="btn m-0"
                                                        onClick={fetchProducts}
                                                        disabled={loading}
                                                    >
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
                            disabled={loading}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-warning"
                            onClick={handleOrderSubmit}
                            disabled={loading || cartItems.length === 0}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Enviando...
                                </>
                            ) : (
                                'Send order'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}