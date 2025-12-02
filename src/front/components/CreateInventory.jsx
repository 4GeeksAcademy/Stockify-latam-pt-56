import React, { useEffect, useState } from "react";
import useGlobalReducer from '../hooks/useGlobalReducer'; // Asume que tienes este hook
// import { useDebounce } from "../hooks/useDebounce"; // Opcional, si quieres búsqueda


export const CreateInventory = () => {
    // 1. ESTADOS Y HOOKS
    const { dispatch, store } = useGlobalReducer()
    const userData = store.userData; // Necesario para el rol 'Administrator'
    const products2 = store.products
    const token = store.token;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para la gestión de ajuste de stock (se usarán dentro del mapeo)
    const [adjustmentQuantities, setAdjustmentQuantities] = useState({});


    // 2. FUNCIÓN DE CARGA DE DATOS
    const fetchProducts = async () => {
        if (!token) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('No se pudo cargar el inventario.');
            }

            const data = await response.json();
            const loadedProducts = data.products || [];

            // 🟢 PASO CLAVE 1: Actualiza el estado local
            setProducts(loadedProducts);

            // 🟢 PASO CLAVE 2: Actualiza el store global (Redux)
            dispatch({ type: 'set_products', payload: loadedProducts });

        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 3. FUNCIÓN DE AJUSTE DE STOCK (Entrada/Descarte)
    const handleStockAdjustment = async (productId, type) => {
        // Obtenemos la cantidad del estado de ajuste específico para este producto
        const quantity = parseInt(adjustmentQuantities[productId]);

        if (!token) {
            alert("ERROR: No se encontró la sesión (token). Por favor, inicie sesión nuevamente.");
            return; // Detiene la ejecución si no hay token

        }

        if (userData?.role !== 'Administrator') {
            alert("Acceso denegado. Solo los administradores pueden ajustar stock.");
            return;
        }

        if (isNaN(quantity) || quantity <= 0) {
            alert("Por favor, ingrese una cantidad válida y positiva.");
            return;
        }

        // 💡 Opcional: Si es 'subtract', verificar que la cantidad no exceda el stock actual
        if (type === 'subtract') {
            const currentStock = products.find(p => p.id === productId)?.stock;
            if (quantity > currentStock) {
                alert(`No puedes retirar ${quantity} unidades. El stock actual es ${currentStock}.`);
                return;
            }
        }


        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/stock_adjustment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ stock: quantity, type })
            });

            const result = await response.json();

            if (response.ok) {
                alert(`✅ Stock actualizado: Nuevo stock es ${result.new_stock} para ${result.product_name || `ID ${productId}`}`);
                await fetchProducts();
            } else {
                alert(`❌ Error al ajustar stock: ${result.msg || response.statusText}`);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
            // Limpia la cantidad de ajuste para el producto específico después de una acción
            setAdjustmentQuantities(prev => {
                const newQuantities = { ...prev };
                delete newQuantities[productId];
                return newQuantities;
            });
        }
    };

    // 4. CICLO DE VIDA
    useEffect(() => {
        fetchProducts();
    }, [token]);

    // 5. RENDERIZADO
    if (loading) return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
            <span className="ms-2">Cargando inventario...</span>
        </div>
    );
    if (error) return <div className="text-center py-5 alert alert-danger">{error}</div>;

    // --- DISEÑO VISUAL MEJORADO ---
    return (
        <div className="container py-4">
            <div className="panel panel-header p-3">
                <h2 className="m-0"><i className="fas fa-warehouse text-white"></i> Gestión de Inventario</h2>
            </div>
            {/* --------------------------- */}

            {products.length === 0 ? (
                <div className="alert alert-info text-center mt-3">
                    <i className="fas fa-info-circle me-2"></i> No hay productos en el inventario para mostrar.
                </div>
            ) : (
                <div className="card shadow-sm border-0">
                    <div className="p-3">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="text-muted">ID</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Precio</th>
                                        <th scope="col" className="text-center">Stock Actual</th>
                                        {userData?.role === 'Administrator' && <th scope="col" className="text-center" style={{ minWidth: '250px' }}>Acciones de Stock</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products2.map((product) => {
                                        const stockInput = adjustmentQuantities[product.id] || '';
                                        const isLowStock = product.stock < 10;

                                        return (
                                            <tr key={product.id}>
                                                <td className="text-muted">{product.id}</td>
                                                <td className="fw-bold">{product.product_name}</td>
                                                <td>${parseFloat(product.price).toFixed(2)}</td>
                                                <td className="text-center">
                                                    <span className={`badge ${isLowStock ? 'bg-danger' : 'bg-success'} p-2 rounded-pill`}>
                                                        {product.stock} {isLowStock && <i className="fas fa-exclamation-triangle ms-1"></i>}
                                                    </span>
                                                </td>

                                                {/* 🚨 COLUMNA DE AJUSTE DE STOCK */}
                                                {userData?.role === 'Administrator' && (
                                                    <td className="text-center">
                                                        <div className="input-group input-group-sm">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                placeholder="Cant."
                                                                className="form-control"
                                                                style={{ maxWidth: '80px' }}
                                                                value={stockInput}
                                                                onChange={(e) =>
                                                                    setAdjustmentQuantities({
                                                                        ...adjustmentQuantities,
                                                                        [product.id]: e.target.value
                                                                    })
                                                                }
                                                            />
                                                            <button
                                                                className="btn btn-outline-success"
                                                                title="Añadir Existencias"
                                                                onClick={() => handleStockAdjustment(product.id, 'add')}
                                                                disabled={!stockInput || parseInt(stockInput) <= 0}
                                                            >
                                                                <i className="fas fa-plus"></i> Entrada
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                title="Descartar o Retirar"
                                                                onClick={() => handleStockAdjustment(product.id, 'subtract')}
                                                                disabled={!stockInput || parseInt(stockInput) <= 0 || parseInt(stockInput) > product.stock}
                                                            >
                                                                <i className="fas fa-minus"></i> Descarte
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Pie de la tarjeta opcional */}
                    <div className="card-footer text-muted text-end small">
                        Datos del inventario actualizados en tiempo real.
                    </div>
                </div>
            )}
        </div>
    );
};