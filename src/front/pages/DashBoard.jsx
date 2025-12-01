import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateCategory } from "../components/CreateCategory";
import ProductComponent2 from "../components/ProductComponent2";
import { CreateInventory } from "../components/CreateInventory";
import { CreateReports } from "../components/CreateReports";
import { ShoppingCart } from "../components/ShoppingCart";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const DashBoard = () => {

    const { dispatch, store } = useGlobalReducer()
    const products = store.products
    const token = store.token
    const categories = store.categories
    const [activeTab, setActiveTab] = React.useState("products")
    const users = store.users || []


    const navigate = useNavigate();

    const sellers = users.filter(user => user.role === 'seller');
    const totalSellers = sellers.length

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate("/login");
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

    const fetchInventaryTotalValue = async () => {
        if (!token) {
            console.warn("Token not available. Cannot fetch inventory value.");
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/inventory/total-value`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const result = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_TOTAL_INVENTARY_VALUE', payload: result.total_value })
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    const calculateTotalUnits = () => {
        if (products.length === 0) return 0;
        // Se usa un parseo para asegurar que 'stock' es un número antes de sumar
        return products.reduce((sum, product) => sum + (parseInt(product.stock) || 0), 0);
    };

    // Almacenar el total de unidades calculadas
    const totalAvailableUnits = calculateTotalUnits()



    useEffect(() => {
        fetchCategories();
        fetchInventaryTotalValue()
    }, [token, dispatch]);

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
                            {typeof totalAvailableUnits === 'number'
                                ? `$${totalAvailableUnits.toFixed(2)}`
                                : '$0.00'}
                        </div>
                        <div className="stat-label">Inventory Total Value</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="stat-number">{totalSellers}</div>
                        <div className="stat-label">Users</div>
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

