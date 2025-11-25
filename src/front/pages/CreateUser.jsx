import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

const ROLES = ['Administrator', 'Seller'];

export const CreateUser = ({ onCreationSuccess }) => {

    const navigate = useNavigate();
    const { store } = useGlobalReducer();
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

        console.log("Datos que se enviarán:", dataToSend);

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
                alert(`✅ Usuario ${result.user.username} creado exitosamente con rol ${result.user.role}.`);
                setFormData({ full_name: '', username: '', password: '', role: ROLES[1] });
                if (onCreationSuccess) onCreationSuccess(result.user);
            } else {
                setError(`Error ${response.status}: ${result.msg || 'Error desconocido del servidor.'}`);
                alert(`Error al crear usuario: ${result.msg || 'Verifica la consola para más detalles.'}`);
            }

        } catch (err) {
            console.error("Error de red o servidor:", err);
            setError("Error de conexión al servidor. Intente de nuevo.");
            alert("Error de conexión al servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
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

               

                <div className="d-flex justify-content-end mb-3">
    <button
        type="button"
        className="btn btn-warning fw-semibold"
        onClick={() => navigate("/userslist")}
        style={{ borderRadius: "0.5rem" }}
    >
        <i className="fa-solid fa-trash-can"></i>
    </button>
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

                    <button type="submit" className="btn btn-warning w-100 fw-bold mb-3">
                        Create a new user account
                    </button>

                    <div className="d-flex align-items-center mb-3">
                        <hr className="flex-grow-1" />
                        <span className="mx-2 text-muted fw-semibold">OR</span>
                        <hr className="flex-grow-1" />
                    </div>

                    <button type="button" className="btn btn-outline-danger w-100 fw-semibold" onClick={() => { navigate("/") }}>
                        Logout
                    </button>
                </form>
            </div>
        </div>
    );
};