import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateCategory } from "../components/CreateCategory";
import ProductComponent2 from "../components/ProductComponent2";
import { CreateInventory } from "../components/CreateInventory";
import { CreateReports } from "../components/CreateReports";
import { ShoppingCart } from "../components/ShoppingCart";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Swal from 'sweetalert2';


export const DashBoard = () => {

    const { dispatch, store } = useGlobalReducer()
    const products = store.products
    const token = store.token
    const userData = store.userData
    const categories = store.categories
    const [activeTab, setActiveTab] = React.useState("products")
    const users = store.users || []


    const navigate = useNavigate();

    const sellers = users.filter(user => user.role === 'Seller');
    const totalSellers = sellers.length

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
            dispatch({ type: 'SET_USERS', payload: data.user })
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
    }

    const fetchProducts = async () => {
        try {
            // Asumo que tienes un endpoint para obtener todos los productos
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
                method: 'GET',
                headers: {
                    "AUTHORIZATION": `Bearer ${store.token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);

            const data = await response.json();
            // 🚨 IMPORTANTE: Asegúrate de que el payload sea el array de productos
            dispatch({ type: 'set_products', payload: data.products });

        } catch (error) {
            console.error("Error al obtener los productos:", error);
            // Manejo de error
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
            const result = await response.json();

            if (response.ok) {
                dispatch({ type: 'set_categories', payload: result.categories })
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const calculateTotalInventoryValue = () => {
        if (products.length === 0) return 0;
        return products.reduce((sum, product) => {
            // Asegurarse de que stock y price_in_usd sean números válidos
            const stock = parseInt(product.stock) || 0;
            const price = parseFloat(product.price) || 0; // Asumo que el precio está en 'price_in_usd'
            return sum + (stock * price);
        }, 0);
    };

    // Calcular el valor total directamente desde store.products. 
    // Esto se recalcula automáticamente en cada re-render del componente
    // causado por un cambio en 'products'.
    const totalInventoryValue = calculateTotalInventoryValue();

    // Opcional: Función para calcular las unidades totales si la quieres
    const calculateTotalUnits = () => {
        if (products.length === 0) return 0;
        return products.reduce((sum, product) => sum + (parseInt(product.stock) || 0), 0);
    };
    const totalAvailableUnits = calculateTotalUnits()



    useEffect(() => {
        fetchCategories();
        {
            userData.role == "Administrator" && (
                fetchUsers()
            )
        }

        // fetchProducts()

    }, [token, totalAvailableUnits])

    return (
        <div className="container">

            {/* Header */}
            <div className="row">
                <div className="col">

                    <header className="app-header d-flex">
                        <div className="col-11 d-flex flex-column">
                            <h1><i className="fas fa-store"></i> Sistema de Gestión de Productos</h1>
                            <p>Administra productos y categorías de tu inventario</p>
                        </div>
                        <div className="col-1 d-flex align-items-end flex-column gap-3">
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
                            {/* Boton Modal */}
                            <ShoppingCart />
                        </div>

                    </header>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="nav-tabs">
                <a
                    className={`nav-tab ${activeTab === "products" ? "active" : ""}`}
                    onClick={() => setActiveTab("products")}
                >
                    <i className="fas fa-cube"></i> Productos
                </a>

                <a
                    className={`nav-tab ${activeTab === "categories" ? "active" : ""}`}  /*active ltab son los buttons*/
                    onClick={() => setActiveTab("categories")}
                >
                    <i className="fas fa-tags"></i> Categorías
                </a>

                <a
                    className={`nav-tab ${activeTab === "inventory" ? "active" : ""}`}
                    onClick={() => setActiveTab("inventory")}
                >
                    <i className="fas fa-boxes"></i> Inventario
                </a>

                <a
                    className={`nav-tab ${activeTab === "reports" ? "active" : ""}`}
                    onClick={() => setActiveTab("reports")}
                >
                    <i className="fas fa-chart-bar"></i> Reportes
                </a>
            </div>



            {/* Estadísticas */}
            {store.userData.role == "Administrator" && (
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="fas fa-cube"></i>
                        </div>
                        <div className="stat-number">{products.length}</div>
                        <div className="stat-label">Total Productos</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="fas fa-tags"></i>
                        </div>
                        <div className="stat-number">{categories.length}</div>
                        <div className="stat-label">Categorías</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="fa-solid fa-money-bill-trend-up"></i>
                        </div>
                        <div className="stat-number">
                            {typeof totalInventoryValue === 'number'
                                ? `$${totalInventoryValue.toFixed(2)}` // Muestra el VALOR TOTAL
                                : '$0.00'}
                        </div>
                        <div className="stat-label">Inventory Total Value</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="stat-number">{totalSellers}</div>
                        <div className="stat-label">Sellers</div>
                    </div>
                </div>

            )}

            {/* Products Tab */}

            {activeTab === "products" && (   /*if the active tab contains products then show us up the component and it provides color*/
                <ProductComponent2 />
            )}

            {activeTab === "categories" && (
                <CreateCategory onCategoryCreated={fetchCategories} />
            )}

            {activeTab === "inventory" && (
                <CreateInventory />
            )}

            {activeTab === "reports" && (
                <CreateReports />
            )}



        </div>
    );
};

