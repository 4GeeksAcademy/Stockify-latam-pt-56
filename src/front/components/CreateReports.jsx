import React, { useEffect, useState } from "react";

export const CreateReports = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            // **IMPORTANTE: Debes crear este endpoint en el backend (ej. /api/orders?status=Pending)**
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders?status=Pending`);

            if (!response.ok) {
                throw new Error('No se pudo cargar la lista de órdenes.');
            }

            const data = await response.json();
            // Asumo que el backend devuelve { "orders": [...] }
            setOrders(data.orders || data);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Error al cargar las órdenes pendientes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleApproveOrder = async (orderId) => {
        if (!window.confirm(`¿Está seguro de aprobar la orden #${orderId}? Esto descontará el stock.`)) {
            return;
        }

        try {
            // Usamos el endpoint PUT /orders/<int:order_id>/approve
            const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // **AQUÍ VA EL TOKEN JWT si la ruta está protegida**
                }
            });

            if (response.ok) {
                alert(`Orden #${orderId} aprobada y stock actualizado.`);
                // 1. Recargar la lista para eliminar la orden aprobada.
                fetchOrders();
            } else {
                const result = await response.json();
                alert(`Error: ${result.msg || 'Stock insuficiente o error del servidor.'}`);
            }
        } catch (err) {
            alert('Error de conexión al aprobar la orden.');
        }
    }

    if (loading) return <div className="text-center py-5">Cargando órdenes...</div>;
    if (error) return <div className="text-center py-5">{error}</div>;

    return (
        <div className="container py-4">
            {/* Seccion de Busqueda (Filtros de Ordenes, Clientes, Fechas) */}
            <div className="search-section">
                <div className="search-container">
                    <div className="form-group search-input">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por cliente o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Puedes añadir un filtro por estado aquí: (Pending, Completed, etc.) */}
                    <div className="form-group filter-select">
                        <select className="form-control">
                            <option value="Pending">Pendiente</option>
                            <option value="Completed">Completada</option>
                        </select>
                    </div>
                    <button className="btn btn-primary">
                        <i className="fas fa-search"></i> Buscar
                    </button>
                </div>
            </div>

            {/* Panel de Órdenes */}
            <div className="panel mt-4">
                <div className="panel-header">
                    <h2><i className="fas fa-receipt"></i> Órdenes Pendientes ({orders.length})</h2>
                </div>
                <div className="panel-body">
                    <div className="orders-grid">
                        {orders.length === 0 ? (
                            <div className="alert alert-info text-center">No hay órdenes pendientes de aprobación.</div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="order-card new">
                                    <div className="order-header d-flex justify-content-between">
                                        <div>
                                            {/* ID de la Orden y Cliente */}
                                            <div className="order-title fw-bold">Orden #{order.id}</div>
                                            <div className="order-client">Cliente: {order.client_name}</div>
                                        </div>
                                        {/* Monto Total */}
                                        <div className="order-price fs-4 fw-bolder">${parseFloat(order.total_amount).toFixed(2)}</div>
                                    </div>

                                    <div className="order-meta mt-2">
                                        {/* Fecha y Dirección */}
                                        <div className="order-date">Fecha: {new Date(order.created_at).toLocaleDateString()}</div>
                                        <div className="order-address">Dirección: {order.delivery_address}</div>
                                        <div className="order-status text-warning">Estado: {order.status}</div>
                                    </div>

                                    {/* Botón de Aprobación */}
                                    <div className="order-actions mt-3 text-end">
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleApproveOrder(order.id)}
                                            disabled={loading}
                                        >
                                            <i className="fas fa-check"></i> Aprobar y Descontar Stock
                                        </button>
                                        {/* Aquí podrías añadir un botón para ver el detalle de la orden */}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};