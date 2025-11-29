import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { CreateUser } from "./CreateUser";

export const UsersList = () => {
    const navigate = useNavigate();
    const { dispatch, store } = useGlobalReducer();
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = React.useState("userslist")

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
        }
    };

    // Eliminar usuario por ID
    const deleteUser = async (userId, username) => {
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

            setUsers(users.filter(user => user.id !== userId));
            alert("Usuario eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("No se pudo eliminar el usuario");
        }
    };

    const handleLogout = () => {
        // 1. Limpiar el estado de la aplicación (token y userData)
        dispatch({ type: 'LOGOUT' });
        navigate("/login");
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container">

            <header className="app-header d-flex justify-content-center align-items-center py-3">
                <div className="col-11 d-flex flex-column">
                    <h1><i className="fas fa-store"></i> Stockify</h1>
                    <p>Administra los usuarios de tu organizacion</p>
                </div>
                <div className="">
                    <button className="btn btn-danger" onClick={handleLogout}>
                        <div className="d-flex justify-content-center align-items-center gap-2">
                            <p className="fs-6 fw-lighter m-0 text-white">
                                Logout
                            </p>
                            <i
                                className="fa-solid fa-right-from-bracket fs-5 m-0 text-white"
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
                    onClick={() => setActiveTab("userslist")}
                >
                    <i className="fas fa-cube"></i> Users
                </a>

                <a
                    className={`nav-tab ${activeTab === "createuser" ? "active" : ""}`}  /*active ltab son los buttons*/
                    onClick={() => setActiveTab("createuser")}
                >
                    <i className="fas fa-tags"></i> Create user
                </a>
            </div>


            {activeTab === "userslist" && (
                <div className="row">
                    {users.map((user) => (
                        <div className="col-md-4 mb-4" key={user.id}>
                            <div className="card shadow-sm border-0 rounded-4">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">{user.full_name}</h5>
                                    <p className="card-text mb-1"><strong>Email:</strong> {user.email}</p>
                                    <p className="card-text mb-1"><strong>Username:</strong> {user.username}</p>
                                    <span className={`badge ${user.role === 'Administrator' ? 'bg-success' : 'bg-secondary'}`}>
                                        {user.role}
                                    </span>
                                    <hr />

                                    {/* Botón Eliminar */}
                                    <button
                                        className="btn btn-outline-danger btn-sm w-100"
                                        onClick={() => deleteUser(user.id, user.username)}
                                    >
                                        Eliminar
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            )}

            {activeTab === "createuser" && (
                <CreateUser />
            )}

        </div>
    );
};



