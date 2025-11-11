import React, { useState } from "react";


const role = ['Administrator', 'Seller']

export const CreateUser = () => {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: role[1]
    })

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Datos del usuario a crear:", formData);

        // Aquí iría tu lógica real para enviar los datos a la API (fetch/axios)
        alert(`Simulación: Usuario ${formData.username} creado con el rol: ${formData.role}`);

        setFormData({
            username: '',
            password: '',
            role: role[1],
        });
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
                <form onSubmit={handleSubmit}>
                    {/* Username */}
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
                            Used for log in youy account
                        </small>
                    </div>

                    {/* Password */}
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
                            {/* Mapeamos la lista de roles definidos */}
                            {role.map(role => (
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

                    <button type="button" className="btn btn-outline-danger w-100 fw-semibold">
                        Logout
                    </button>
                </form>
            </div>
        </div>
    )
}