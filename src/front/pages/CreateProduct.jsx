import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import  { CreateCategory }  from "../components/CreateCategory";
import  ProductsComponent  from "../components/ProductsComponent";
import { CreateInventory } from "../components/CreateInventory";
import { CreateReports } from "../components/CreateReports";

export const CreateProduct = () => {
    const [activeTab, setActiveTab] = React.useState("products");

    const navigate = useNavigate();
   

    const goBack = () => {
        navigate("/");    /*aquí va la ruta adonde dirigirá el botón regresar, aún por definir*/
    }
    useEffect(() => {
        // Navigation Tabs
        // document.querySelectorAll('.nav-tab').forEach(tab => {
        //     tab.addEventListener('click', function (e) {
        //         e.preventDefault();

        //         document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        //         document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        //         this.classList.add('active');

        //         const tabId = this.getAttribute('data-tab');
        //         document.getElementById(`${tabId}-tab`).classList.add('active');
        //     });
        // });

        // Form Submissions
        document.getElementById('productForm')?.addEventListener('submit', function (e) {
            e.preventDefault();
            //             <div class="alert alert-warning" role="alert">
            //   A simple warning alert—check it out!
            // {/* </div> */}

            // alert('En una implementación real, esto crearía un nuevo producto en la base de datos.');
        });

        // document.getElementById('categoryForm')?.addEventListener('submit', function (e) {
        //     e.preventDefault();
        //     alert('En una implementación real, esto crearía una nueva categoría en la base de datos.');
        // });

        // Image Preview
        const imageInput = document.getElementById('productImage');
        if (imageInput) {
            imageInput.addEventListener('change', function (e) {
                const file = e.target.files[0];
                const preview = document.querySelector('.image-preview');

                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        preview.innerHTML = `<img src="${e.target.result}" alt="Vista previa" />`;
                    };
                    reader.readAsDataURL(file);
                } else {
                    preview.innerHTML = '<i class="fas fa-image" style="color: var(--gray);"></i>';
                }
            });
        }

    }, []);

    return (
        <div className="container">

            {/* Header */}
            <header className="app-header">
                <button className="btn btn-primary btn-position " onClick={goBack}>
                    <i className="fa-sharp fa-solid fa-arrow-left"></i> Regresar
                </button>
                <h1><i className="fas fa-store"></i> Sistema de Gestión de Productos</h1>
                <p>Administra productos y categorías de tu inventario</p>
            </header>

            {/* Navigation Tabs */}
            <div className="nav-tabs">
    <a 
        className={`nav-tab ${activeTab === "products" ? "active" : ""}`} 
        onClick={() => setActiveTab("products")}
    >
        <i className="fas fa-cube"></i> Productos
    </a>

    <a 
        className={`nav-tab ${activeTab === "categories" ? "active" : ""}`} 
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



            {/* Statistics */}
            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-cube"></i>
                    </div>
                    <div className="stat-number">156</div>
                    <div className="stat-label">Total Productos</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-tags"></i>
                    </div>
                    <div className="stat-number">12</div>
                    <div className="stat-label">Categorías</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-number">142</div>
                    <div className="stat-label">En Stock</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="stat-number">14</div>
                    <div className="stat-label">Stock Bajo</div>
                </div>
            </div>

            {/* Products Tab */}
            
{activeTab === "products" && (
    <ProductsComponent />  
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

