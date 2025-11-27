import React, { useEffect, useState } from "react";
import useGlobalReducer from '../hooks/useGlobalReducer';
import { useDebounce } from "../hooks/useDebounce";


export const CreateReports = () => {

    const { store } = useGlobalReducer(); // Obtener el store para acceder a userData y token
    const userData = store.userData; // { id: ..., rol: 'Administrator' | 'Seller' }
    const token = store.token;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('Pending')

    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            // Construir la URL con filtros
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            if (debouncedSearchTerm) params.append('client_name', debouncedSearchTerm);

            const url = `${import.meta.env.VITE_BACKEND_URL}/api/orders?${params.toString()}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}` // Incluir el token JWT
                }
            });

            if (!response.ok) {
                // Manejo específico para 401/403 si el JWT expira o no tiene permisos
                if (response.status === 401 || response.status === 403) {
                    throw new Error('No autorizado o sesión expirada. Por favor, inicie sesión.');
                }
                throw new Error('No se pudo cargar la lista de órdenes.');
            }

            const data = await response.json();
            setOrders(data.orders || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message || "Error al cargar las órdenes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            // 👈 4. CAMBIAR DEPENDENCIAS: Ahora solo se ejecuta cuando debouncedSearchTerm cambie
            fetchOrders();
        } else {
            setError("No ha iniciado sesión.");
            setLoading(false);
        }
    }, [token, statusFilter, debouncedSearchTerm])

    const handleApproveOrder = async (orderId) => {
        // Validación de rol ANTES de enviar la petición
        if (userData?.role !== 'Administrator') {
            alert("Acceso denegado. Solo los administradores pueden aprobar órdenes.");
            return;
        }

        if (!window.confirm(`¿Está seguro de aprobar la orden #${orderId}? Esto descontará el stock.`)) {
            return;
        }

        setLoading(true); // Opcional: mostrar un loading específico para la orden
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert(`Orden #${orderId} aprobada y stock actualizado.`);
                fetchOrders(); // Recargar la lista
            } else {
                const result = await response.json();
                alert(`Error al aprobar orden #${orderId}: ${result.msg || 'Error del servidor.'}`);
            }
        } catch (err) {
            console.error("Error de conexión al aprobar la orden:", err);
            alert('Error de conexión al aprobar la orden.');
        } finally {
            setLoading(false);
        }
    }

    const filteredOrdersForSeller = userData?.role === 'Seller'
        ? orders.filter(order => order.created_by_user_id === userData.id) // Asumiendo un campo 'created_by_user_id' en la orden
        : orders;

    if (loading) return <div className="text-center py-5">Cargando órdenes...</div>;
    if (error) return <div className="text-center py-5">{error}</div>;

    return (
        <div className="container py-4">
            <div className="card shadow mb-4">
                <div className="card-header bg-warning text-dark py-3">
                    <h2 className="h4 mb-0"><i className="fas fa-receipt me-2"></i> Órdenes Pendientes ({filteredOrdersForSeller.length})</h2>
                </div>
                <div className="card-body">
                    {/* Sección de Búsqueda y Filtros */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                        <div className="input-group flex-grow-1" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por cliente o ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn btn-outline-secondary" type="button">
                                <i className="fas fa-search"></i>
                            </button>
                        </div>

                        <div className="form-group mb-0" style={{ maxWidth: '200px' }}>
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="Pending">Pendientes</option>
                                <option value="Completed">Completadas</option>
                                <option value="Cancelled">Canceladas</option>
                                <option value="">Todas</option>
                            </select>
                        </div>
                    </div>

                    {/* Lista de Órdenes */}
                    {filteredOrdersForSeller.length === 0 ? (
                        <div className="alert alert-info text-center mt-3">
                            {userData?.role === 'Seller' ? 'No tienes órdenes pendientes.' : 'No hay órdenes pendientes de aprobación.'}
                        </div>
                    ) : (
                        <div className="row g-4"> {/* Usa row y g-4 para espaciado entre cards */}
                            {filteredOrdersForSeller.map((order) => (
                                <div key={order.id} className="col-12 col-md-6 col-lg-4"> {/* Tarjetas responsivas */}
                                    <div className="card shadow-sm h-100"> {/* h-100 para altura uniforme */}
                                        <div className="card-body d-flex flex-column justify-content-between">
                                            <div>
                                                <h5 className="card-title d-flex justify-content-between align-items-center mb-3">
                                                    <span>Orden #{order.id}</span>
                                                    <span className="badge bg-primary fs-6">${parseFloat(order.total_amount).toFixed(2)}</span>
                                                </h5>
                                                <p className="card-text mb-1">
                                                    <strong>Cliente:</strong> {order.client_name}
                                                </p>
                                                {/* Mostrar Fecha de Creación (si no es Invalid Date) */}
                                                <p className="card-text mb-1">
                                                    <strong>Fecha:</strong> {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                                </p>
                                                {/* Mostrar Dirección (si existe) */}
                                                <p className="card-text mb-1">
                                                    <strong>Dirección:</strong> {order.delivery_address || 'No especificada'}
                                                </p>
                                                <p className="card-text mb-3">
                                                    <strong>Estado:</strong> <span className={`badge ${order.status === 'Pending' ? 'bg-warning text-dark' : 'bg-success'}`}>{order.status}</span>
                                                </p>
                                            </div>

                                            {/* Botón de Aprobación */}
                                            {userData?.role === 'Administrator' && order.status === 'Pending' && (
                                                <div className="mt-3 text-end">
                                                    <button
                                                        className="btn btn-success btn-sm w-100"
                                                        onClick={() => handleApproveOrder(order.id)}
                                                        disabled={loading}
                                                    >
                                                        <i className="fas fa-check me-2"></i> Aprobar y Descontar Stock
                                                    </button>
                                                </div>
                                            )}
                                            {/* Opcional: Mostrar un mensaje para Seller */}
                                            {userData?.role === 'Seller' && order.status === 'Pending' && (
                                                <div className="mt-3 text-muted text-center">
                                                    Solo los administradores pueden aprobar órdenes.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};