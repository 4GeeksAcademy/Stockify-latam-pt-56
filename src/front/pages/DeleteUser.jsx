    import React, { useState } from "react";
    import useGlobalReducer from "../hooks/useGlobalReducer";
    import { useNavigate } from "react-router-dom";

    const ROLES = ['Administrator', 'Seller']

    export const DeleteUser = () => {


        const navigate = useNavigate()

        const { store } = useGlobalReducer()
        const token = store.token
        const [users, setUsers] = useState([]);
        

        const [formData, setFormData] = useState({
            full_name: '',
            email: '',
            username: '',
            password: '',
            role: ROLES[1],
            user_id: '',
        })

    

        const handleInputChange = (e) => {
            const { id, value } = e.target
            setFormData(prev => ({
                ...prev,
                [id]: value
            }))
        }

        const handleSubmit = async (e) => {
            e.preventDefault();
            

            if (!token) {
                setError("Error: Usuario Master no autenticado. Por favor, inicie sesión primero.");
                
                return;
            }

            

        console.log("Deleting user with data:", formData);

            await deleteUser(parseInt(formData.user_id), formData.username);

        }

        // const fetchUsers = async () => {
        //     try {
        //         const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        //             method: 'GET',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             }
        //         });

        //         if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);

        //         const data = await response.json();
        //         setUsers(data.user);
        //     } catch (error) {
        //         console.error("Error al obtener los usuarios:", error);
        //     }
        // };

        // Eliminar usuario por ID
        const deleteUser = async (userId, username) => {
            // if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/user`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${store.token}` // si tu backend requiere token
                    },
                    body: JSON.stringify({ user_id: userId, user_name: username }),
                });
console.log("Delete user response:", response);
console.log("Request body:", { user_id: userId, user_name: username }); 
                if (!response.ok) throw new Error("Error eliminando usuario");

                // Filtrar y actualizar lista local sin recargar
                // setUsers(users.filter(user => user.id !== userId));
                alert("Usuario eliminado correctamente");
            } catch (error) {
                console.error("Error al eliminar usuario:", error);
                alert("No se pudo eliminar el usuario");
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
                                    <p className="m-0 mt-2 fs-4 fw-bold">Delete User</p>
                                    <p className="fw-lighter">Delete user in your organization</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {/* <div className="mb-3 text-start">
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
                        </div> */}
                        {/* User_id */}
                        <div className="mb-3 text-start">
                            <label htmlFor="user_id" className="form-label fw-semibold">
                                ID
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="user_id"
                                placeholder="Enter full name for new user"
                                value={formData.user_id}
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
                                {ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                            <small className="form-text text-muted">
                                Select between Administrator (full access) and Seller (limited access).
                            </small>
                        </div>

                        <button type="submit" className="btn btn-warning w-100 fw-bold mb-3">
                            Delete an user account
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
        )
    }