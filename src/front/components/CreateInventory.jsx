import React, { useEffect, useState } from "react";
import useGlobalReducer from '../hooks/useGlobalReducer'; // Asume que tienes este hook
// import { useDebounce } from "../hooks/useDebounce"; // Opcional, si quieres búsqueda


export const CreateInventory = () => {
    // 1. ESTADOS Y HOOKS
    const { store } = useGlobalReducer();
    const userData = store.userData; // Necesario para el rol 'Administrator'
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
            setProducts(data.products || []);
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
        console.log("Token a enviar:", token)

        if (userData?.role !== 'Administrator') {
            alert("Acceso denegado. Solo los administradores pueden ajustar stock.");
            return;
        }

        if (isNaN(quantity) || quantity <= 0) {
            alert("Por favor, ingrese una cantidad válida y positiva.");
            return;
        }

        const actionText = type === 'add' ? 'AÑADIR' : 'RESTAR/DESCARTAR';
        const confirmation = window.confirm(
            `¿Está seguro de ${actionText} ${quantity} unidades del producto ID #${productId}?`
        );

        if (!confirmation) return;

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/stock_adjustment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity, type })
            });

            const result = await response.json();

            if (response.ok) {
                alert(`✅ Stock actualizado: Nuevo stock es ${result.new_stock} para ${result.product_name || `ID ${productId}`}`);
                fetchProducts(); // Recargar la lista
            } else {
                alert(`❌ Error al ajustar stock: ${result.msg || response.statusText}`);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    // 4. CICLO DE VIDA
    useEffect(() => {
        fetchProducts();
    }, [token]);

    // 5. RENDERIZADO
    if (loading) return <div className="text-center py-5">Cargando inventario...</div>;
    if (error) return <div className="text-center py-5 alert alert-danger">{error}</div>;

    return (
        <div className="container py-4">
            <h2 className="mb-4"><i className="fas fa-warehouse me-2"></i> Gestión de Inventario</h2>

            {products.length === 0 ? (
                <div className="alert alert-info text-center mt-3">No hay productos en el inventario.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Stock Actual</th>
                                {userData?.role === 'Administrator' && <th>Acciones de Stock</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>${parseFloat(product.price).toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${product.stock < 10 ? 'bg-danger' : 'bg-success'}`}>
                                            {product.stock}
                                        </span>
                                    </td>

                                    {/* 🚨 COLUMNA DE AJUSTE DE STOCK */}
                                    {userData?.role === 'Administrator' && (
                                        <td>
                                            <div className="d-flex gap-2 align-items-center">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    placeholder="Cant."
                                                    className="form-control form-control-sm"
                                                    style={{ width: '80px' }}
                                                    // Actualiza el estado específico del ID del producto
                                                    onChange={(e) =>
                                                        setAdjustmentQuantities({
                                                            ...adjustmentQuantities,
                                                            [product.id]: e.target.value
                                                        })
                                                    }
                                                />
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    title="Añadir Existencias"
                                                    onClick={() => handleStockAdjustment(product.id, 'add')}
                                                >
                                                    <i className="fas fa-plus"></i>
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    title="Descartar o Retirar"
                                                    onClick={() => handleStockAdjustment(product.id, 'subtract')}
                                                >
                                                    <i className="fas fa-minus"></i>
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};