import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateCategory } from "../components/CreateCategory";
import ProductsComponent from "../components/ProductsComponent";
import ProductComponent2 from "../components/ProductComponent2";
import { CreateInventory } from "../components/CreateInventory";
import { CreateReports } from "../components/CreateReports";
import { ShoppingCart } from "../components/ShoppingCart";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const CreateProduct = () => {

    const { dispatch, store } = useGlobalReducer()
    const products = store.products
    const categories = store.categories
    const userData = store.userData
    const [activeTab, setActiveTab] = React.useState("products");  /*save the button that I press*/
    const [showModal, setShowModal] = useState(false);
    console.log(userData)

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false)

    const navigate = useNavigate(); //para que pueda regresar a la página anterior

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

    useEffect(() => {
        fetchCategories();
    }, []);


    const goBack = () => {
        navigate("/");
    }

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
                            <button className="btn btn-primary" onClick={goBack}>
                                <i className="fa-sharp fa-solid fa-arrow-left"></i> Regresar
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
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-number">152</div>
                    <div className="stat-label">Available units</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="stat-number">{ }</div>
                    <div className="stat-label">Vendors</div>
                </div>
            </div>

            {/* Products Tab */}

            {activeTab === "products" && (   /*if the active tab contains products then show us up the component and it provides color*/
                <ProductComponent2 />
            )}

            {activeTab === "categories" && (
                <CreateCategory />
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

