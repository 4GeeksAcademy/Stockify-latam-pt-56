import React, { useEffect, useState } from "react";
import useGlobalReducer from '../hooks/useGlobalReducer';
import { useDebounce } from "../hooks/useDebounce";
import Swal from 'sweetalert2';

export const CreateReports = () => {
    const { store } = useGlobalReducer();
    const userData = store.userData;
    const token = store.token;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('Pending')
    const [approveLoading, setApproveLoading] = useState(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            if (debouncedSearchTerm) params.append('client_name', debouncedSearchTerm);

            const url = `${import.meta.env.VITE_BACKEND_URL}/api/orders?${params.toString()}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        // Convertir el string ISO (del backend) a un objeto Date
        const date = new Date(dateString);

        // Opciones de formato
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        // Devolver la fecha formateada
        return date.toLocaleDateString('es-VE', options);
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        } else {
            setError("No ha iniciado sesión.");
            setLoading(false);
        }
    }, [token, statusFilter, debouncedSearchTerm])

    const handleApproveOrder = async (orderId, clientName, totalAmount) => {
        // Validación de rol
        if (userData?.role !== 'Administrator') {
            await Swal.fire({
                title: 'Acceso Denegado',
                html: `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin: 10px 0;">🚫</div>
                        <p>Solo los administradores pueden aprobar órdenes</p>
                    </div>
                `,
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#f59e0b'
            });
            return;
        }

        //  CONFIRMACIÓN  PARA APROBAR ORDEN
        const confirmResult = await Swal.fire({
            title: '✅ Aprobar Orden',
            html: `
                <div style="text-align: center;">
                    <p>¿Estás seguro de aprobar esta orden?</p>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Orden #${orderId}</strong><br/>
                        <small style="color: #6b7280;">Cliente: ${clientName}</small><br/>
                        <small style="color: #6b7280;">Total: $${parseFloat(totalAmount).toFixed(2)}</small>
                    </div>
                    <small style="color: #6b7280;">
                        ⚠️ Esta acción descontará el stock de los productos
                    </small>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, aprobar orden',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            focusConfirm: false
        });

        if (!confirmResult.isConfirmed) {
            //  Feedback cuando el usuario cancela
            await Swal.fire({
                title: 'Aprobación Cancelada',
                text: `La orden #${orderId} permanece pendiente`,
                icon: 'info',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        setApproveLoading(orderId);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                //  ORDEN APROBADA
                await Swal.fire({
                    title: '¡Orden Aprobada!',
                    html: `
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; color: #10b981; margin: 10px 0;">
                                ✅
                            </div>
                            <p>La orden ha sido aprobada exitosamente</p>
                            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0;">
                                <strong>Orden #${orderId}</strong><br/>
                                <small style="color: #6b7280;">Stock descontado correctamente</small>
                            </div>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                    confirmButtonColor: '#10b981',
                    timer: 4000,
                    timerProgressBar: true,
                    willClose: () => {
                        fetchOrders(); // Recargar la lista después de cerrar
                    }
                });
            } else {
                const result = await response.json();
                //  ERROR DEL SERVIDOR
                await Swal.fire({
                    title: 'Error al Aprobar',
                    html: `
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin: 10px 0;">😕</div>
                            <p>${result.msg || 'No se pudo aprobar la orden'}</p>
                            <small style="color: #6b7280;">
                                ${result.msg && result.msg.includes('stock') ? 'Verifica el stock disponible' : ''}
                                ${result.msg && result.msg.includes('orden') ? 'La orden no existe o ya fue procesada' : ''}
                            </small>
                        </div>
                    `,
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#ef4444'
                });
            }
        } catch (err) {
            console.error("Error de conexión al aprobar la orden:", err);
            //  ERROR DE CONEXIÓN
            await Swal.fire({
                title: 'Error de Conexión',
                html: `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin: 10px 0;">📡</div>
                        <p>No se pudo conectar con el servidor</p>
                        <small style="color: #6b7280;">
                            Verifica tu conexión a internet e intenta nuevamente
                        </small>
                    </div>
                `,
                icon: 'error',
                confirmButtonText: 'Reintentar',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setApproveLoading(null);
        }
    }

    const filteredOrdersForSeller = userData?.role === 'Seller'
        ? orders.filter(order => order.created_by_user_id === userData.id)
        : orders;

    if (loading) return (
        <div className="container py-4">
            <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Cargando órdenes...</span>
                </div>
                <p className="mt-3 text-muted">Cargando órdenes...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="container py-4">
            <div className="alert alert-danger text-center mt-3">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
            </div>
        </div>
    );

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
                                <option value="">Todas</option>
                            </select>
                        </div>
                    </div>

                    {/* Lista de Órdenes */}
                    {filteredOrdersForSeller.length === 0 ? (
                        <div className="alert alert-info text-center mt-3">
                            <i className="fas fa-info-circle me-2"></i>
                            {userData?.role === 'Seller' ? 'No tienes órdenes pendientes.' : 'No hay órdenes pendientes de aprobación.'}
                        </div>
                    ) : (
                        <div className="row g-4">
                            {filteredOrdersForSeller.map((order) => (
                                <div key={order.id} className="col-12 col-md-6 col-lg-4">
                                    <div className="card shadow-sm h-100">
                                        <div className="card-body d-flex flex-column justify-content-between">
                                            <div>
                                                <h5 className="card-title d-flex justify-content-between align-items-center mb-3">
                                                    <span>Orden #{order.id}</span>
                                                    <span className="badge bg-primary fs-6">${parseFloat(order.total_amount).toFixed(2)}</span>
                                                </h5>
                                                <p className="card-text mb-1">
                                                    <strong>Cliente:</strong> {order.client_name}
                                                </p>
                                                <p className="card-text mb-1">
                                                    <strong>Fecha:</strong> {formatDate(order.created_at)}
                                                </p>
                                                <p className="card-text mb-1">
                                                    <strong>Dirección:</strong> {order.delivery_address || 'Dirección no disponible'}
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
                                                        onClick={() => handleApproveOrder(order.id, order.client_name, order.total_amount)}
                                                        disabled={approveLoading === order.id}
                                                    >
                                                        {approveLoading === order.id ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                Procesando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-check me-2"></i> Aprobar y Descontar Stock
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                            {userData?.role === 'Seller' && order.status === 'Pending' && (
                                                <div className="mt-3 text-muted text-center">
                                                    <small>
                                                        <i className="fas fa-clock me-1"></i>
                                                        Esperando aprobación del administrador
                                                    </small>
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