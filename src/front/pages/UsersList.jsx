import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { CreateUser } from "./CreateUser";
import Swal from 'sweetalert2';

export const UsersList = () => {
    const navigate = useNavigate();
    const { dispatch, store } = useGlobalReducer();
    const userData = store.userData;
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = React.useState("userslist");
    const [deleteLoading, setDeleteLoading] = useState(null);

    // Obtener usuarios
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/user`, {
                method: 'GET',
                headers: {
                    "AUTHORIZATION": `Bearer ${store.token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);

            const data = await response.json();
            setUsers(data.user);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            await Swal.fire({
                title: 'Error de Carga',
                html: `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin: 10px 0;">😕</div>
                        <p>No se pudieron cargar los usuarios</p>
                        <small style="color: #6b7280;">
                            Verifica tu conexión e intenta nuevamente
                        </small>
                    </div>
                `,
                icon: 'error',
                confirmButtonText: 'Reintentar',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        if (tabName === "userslist") {
            fetchUsers();
        }
    };

    const handleUserCreated = () => {
        fetchUsers();
        setActiveTab("userslist");
    };

    const getUserDisplayName = (user) => {
        return user.full_name || user.username || user.email || 'Usuario sin nombre';
    };

    // Eliminar usuario por ID
    const deleteUser = async (userId, username, user) => {
        const userDisplayName = getUserDisplayName(user);
        const confirmResult = await Swal.fire({
            title: '🗑️ Eliminar Usuario',
            html: `
                <div style="text-align: center;">
                    <p>¿Estás seguro de que quieres eliminar este usuario?</p>
                    <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>${userDisplayName}</strong><br/>
                        <small style="color: #6b7280;">@${username || 'sin-usuario'}</small>
                        ${user.email ? `<br/><small style="color: #6b7280;">${user.email}</small>` : ''}
                    </div>
                    <small style="color: #dc2626;">
                        ⚠️ Esta acción no se puede deshacer
                    </small>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar usuario',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            focusConfirm: false
        });

        if (!confirmResult.isConfirmed) {
            await Swal.fire({
                title: 'Eliminación Cancelada',
                text: `El usuario "${userDisplayName}" se mantiene en el sistema`,
                icon: 'info',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        setDeleteLoading(userId);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${store.token}`
                },
                body: JSON.stringify({ user_id: userId, user_name: username }),
            });

            if (!response.ok) throw new Error("Error eliminando usuario");
            await Swal.fire({
                title: '¡Usuario Eliminado!',
                html: `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; color: #10b981; margin: 10px 0;">
                            ✅
                        </div>
                        <p>El usuario ha sido eliminado exitosamente</p>
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            <strong>${userDisplayName}</strong><br/>
                            <small style="color: #6b7280;">@${username || 'sin-usuario'}</small>
                        </div>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#10b981',
                timer: 3000,
                timerProgressBar: true
            });

            // Recargar la lista después de eliminar
            fetchUsers();

        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            await Swal.fire({
                title: 'Error al Eliminar',
                html: `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin: 10px 0;">😕</div>
                        <p>No se pudo eliminar el usuario</p>
                        <small style="color: #6b7280;">
                            El usuario podría tener órdenes asociadas o no existe
                        </small>
                    </div>
                `,
                icon: 'error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleLogout = async () => {
        const userDisplayName = store.userData?.username || store.userData?.email || 'Usuario';

        const confirmResult = await Swal.fire({
            title: '🚪 Cerrar Sesión',
            html: `
                <div style="text-align: center;">
                    <p>¿Estás seguro de que quieres cerrar sesión?</p>
                    <div style="background: #fffbeb; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>${userDisplayName}</strong><br/>
                        ${store.userData?.email ? `<small style="color: #6b7280;">${store.userData.email}</small>` : ''}
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        if (confirmResult.isConfirmed) {
            await Swal.fire({
                title: '¡Sesión Cerrada!',
                html: `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; color: #6b7280; margin: 10px 0;">
                            👋
                        </div>
                        <p>Has cerrado sesión exitosamente</p>
                        <small style="color: #6b7280;">
                            Redirigiendo al login...
                        </small>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#6b7280',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                willClose: () => {
                    dispatch({ type: 'LOGOUT' });
                    navigate("/login");
                }
            });
        } else {
            await Swal.fire({
                title: 'Logout Cancelado',
                text: 'Tu sesión sigue activa',
                icon: 'info',
                timer: 1500,
                showConfirmButton: false
            });
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container">
            <header className="app-header d-flex justify-content-center align-items-center py-3">
                <div className="col-11 d-flex flex-column">
                    <h1><i className="fas fa-store"></i> Stockify</h1>
                    <p>Administra los usuarios de tu organización</p>
                </div>
                <div className="">
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                        <div className="d-flex justify-content-center align-items-center gap-2">
                            <p className="fs-6 text-white m-0">
                                Logout
                            </p>
                            <i
                                className="fa-solid fa-right-from-bracket fs-5 m-0"
                                style={{ cursor: 'pointer' }}
                            >
                            </i>
                        </div>
                    </button>
                </div>
            </header>

            <div className="nav-tabs">
                <a
                    className={`nav-tab ${activeTab === "userslist" ? "active" : ""}`}
                    onClick={() => handleTabChange("userslist")}
                >
                    <i className="fas fa-users"></i> Users
                </a>

                <a
                    className={`nav-tab ${activeTab === "createuser" ? "active" : ""}`}
                    onClick={() => handleTabChange("createuser")}
                >
                    <i className="fas fa-user-plus"></i> Create user
                </a>
            </div>

            {activeTab === "userslist" && (
                <div className="row">
                    {users.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <div className="empty-state">
                                <i className="fas fa-users fs-1 text-muted mb-3"></i>
                                <h3>No hay usuarios</h3>
                                <p className="text-muted">Crea el primer usuario usando el formulario</p>
                            </div>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div className="col-md-4 mb-4" key={user.id}>
                                <div className="card shadow-sm border-0 rounded-4">
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">
                                            {getUserDisplayName(user)}
                                        </h5>
                                        <p className="card-text mb-1">
                                            <strong>Email:</strong> {user.email || 'No especificado'}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Username:</strong> {user.username || 'No especificado'}
                                        </p>
                                        <span className={`badge ${user.role === 'Administrator' ? 'bg-success' : 'bg-secondary'}`}>
                                            {user.role || 'Sin rol'}
                                        </span>
                                        <hr />

                                        {/* Botón Eliminar */}
                                        <button
                                            className="btn btn-outline-danger btn-sm w-100"
                                            onClick={() => deleteUser(user.id, user.username, user)}
                                            disabled={deleteLoading === user.id}
                                        >
                                            {deleteLoading === user.id ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Eliminando...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-trash me-2"></i>
                                                    Eliminar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "createuser" && (
                <CreateUser onCreationSuccess={handleUserCreated} />
            )}
        </div>
    );
};