import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Swal from 'sweetalert2';

const ROLES = ['Administrator', 'Seller'];

export const CreateUser = ({ onCreationSuccess }) => {

    const { dispatch, store } = useGlobalReducer();
    const token = store.token;

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        username: '',
        password: '',
        role: ROLES[1]
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!token) {
            setError("Error: Usuario Master no autenticado. Por favor, inicie sesión primero.");
            setLoading(false);
            return;
        }

        const dataToSend = {
            email: formData.email,
            username: formData.username,
            password: formData.password,
            role: formData.role,
            full_name: formData.full_name
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            const result = await response.json();

            if (response.ok) {
                await Swal.fire({
                    title: '¡Usuario Creado!',
                    html: `
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; color: #10b981; margin: 10px 0;">
                                ✅
                            </div>
                            <p>Usuario creado exitosamente</p>
                            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0;">
                                <strong>${result.user.username}</strong><br/>
                                <small style="color: #6b7280;">Rol: ${result.user.role}</small>
                            </div>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                    confirmButtonColor: '#10b981'
                });

                // Limpiar formulario
                setFormData({
                    full_name: '',
                    email: '',
                    username: '',
                    password: '',
                    role: ROLES[1]
                });

                if (onCreationSuccess) {
                    onCreationSuccess(result.user);
                }

            } else {
                await Swal.fire({
                    title: 'Error al Crear Usuario',
                    html: `
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin: 10px 0;">😕</div>
                            <p>${result.msg || 'Error del servidor'}</p>
                            <small style="color: #6b7280;">
                                ${result.msg && result.msg.includes('email') ? 'El email ya está en uso' : ''}
                                ${result.msg && result.msg.includes('username') ? 'El nombre de usuario ya existe' : ''}
                            </small>
                        </div>
                    `,
                    icon: 'error',
                    confirmButtonText: 'Intentar Nuevamente',
                    confirmButtonColor: '#ef4444'
                });
            }

        } catch (err) {
            console.error("Error de red o servidor:", err);
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
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4" style={{ width: "50rem", borderRadius: "1rem" }}>
                <div className="row">
                    <div className="col">
                        <div className="d-flex justify-content-start align-items-center">
                            <i className="fs-4 fa-solid fa-user-plus border border-5 border-light rounded-circle p-3"></i>
                            <div className="px-4 m-0">
                                <p className="m-0 mt-2 fs-4 fw-bold">Add new User</p>
                                <p className="fw-lighter">Add new user in your organization and set their roles.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label htmlFor="email" className="form-label fw-semibold">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter address for new user"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label htmlFor="full_name" className="form-label fw-semibold">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="full_name"
                            placeholder="Enter full name for new user"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label htmlFor="username" className="form-label fw-semibold">
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Enter username for new user"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        />
                        <small className="form-text text-muted">
                            Used for log in your account
                        </small>
                    </div>

                    <div className="mb-3 text-start">
                        <label htmlFor="password" className="form-label fw-semibold">
                            User password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter password for new user"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        />
                        <small className="form-text text-muted">
                            Used for account creation
                        </small>
                    </div>

                    <div className="mb-3 text-start">
                        <label htmlFor="role" className="form-label fw-semibold">
                            User Role
                        </label>
                        <select
                            className="form-select"
                            id="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        >
                            <option value="" disabled>Seleccione un rol</option>
                            {ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <small className="form-text text-muted">
                            Select between Administrator (full access) and Seller (limited access).
                        </small>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-warning w-100 fw-bold mb-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Creando Usuario...
                            </>
                        ) : (
                            'Create a new user account'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
