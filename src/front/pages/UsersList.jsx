import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const UsersList = () => {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();
    const [users, setUsers] = useState([]);

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
        // if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${store.token}` // si mi backend requiere token
                },
                body: JSON.stringify({ user_id: userId, user_name: username }),
            });

            if (!response.ok) throw new Error("Error eliminando usuario");

            // Filtrar y actualizar lista local sin recargar
            setUsers(users.filter(user => user.id !== userId));
            alert("Usuario eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("No se pudo eliminar el usuario");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    return (
        <div className="container mt-4">
            
            <nav className="navbar navbar-expand-lg mb-4" style={{ backgroundColor: "#FFD700" }}>
  <div className="container-fluid justify-content-center">
    <span className="navbar-brand fw-bold text-danger">
      Users List
    </span>
    

    
  </div>
</nav>

           

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
                                    className="btn btn-success btn-sm w-100"
                                    onClick={() => deleteUser(user.id, user.username)}
                                >
                                    🗑 Eliminar
                                </button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
