
// revisar con el grupo, antonio y gustavo

import React, { useEffect, useState } from "react";

const ProductsComponent = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Cargar categorías desde la API
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
            const result = await response.json();

            if (response.ok) {
                setCategories(result.categories);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();

        // Resto del código existente para productos...
        const confirmBtn = document.getElementById("confirmCreate");
        const form = document.getElementById("productForm");

        if (confirmBtn && form) {
            confirmBtn.addEventListener("click", async () => {
                const preview = document.querySelector('.image-preview');
                console.log("Product created successfully!");
                preview.innerHTML = '<i class="fas fa-image" style="color: var(--gray);"></i>';

                const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
                modal.hide();
                form.reset();
            });
        }

        document.getElementById('productForm')?.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log("enviar");
        });

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
        <div id="products-tab" className="tab-content active">
            {/* Search and Filters*/}
            <div className="search-section">
                <div className="search-container">
                    <div className="form-group search-input">
                        <input type="text" className="form-control" placeholder="Buscar productos..." />
                    </div>
                    <div className="form-group filter-select">
                        <select className="form-control">
                            <option value="">Seleccionar categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-primary">
                        <i className="fas fa-search"></i> Buscar
                    </button>
                </div>
            </div>

            {/* Resto del código del componente de productos... */}
            <div className="main-layout">
                {/* Create Product Panel */}
                <div className="panel">
                    <div className="panel-header">
                        <h2><i className="fas fa-plus-circle"></i> Crear Nuevo Producto</h2>
                    </div>
                    <div className="panel-body">
                        <form id="productForm">
                            <div className="form-group">
                                <label className="form-label" htmlFor="productName">Nombre del Producto</label>
                                <input type="text" className="form-control" id="productName" placeholder="Ej: iPhone 14 Pro" />
                                <div className="form-text">Nombre descriptivo del producto.</div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="productPrice">Precio ($)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="productPrice"
                                        placeholder="0.00"
                                        onInput={(e) => {
                                            let value = e.target.value;
                                            value = value.replace(/[^0-9.]/g, "");
                                            value = value.replace(/(\..*)\./g, "$1");
                                            if (value.includes(".")) {
                                                const parts = value.split(".");
                                                parts[1] = parts[1].slice(0, 2);
                                                value = parts.join(".");
                                            }
                                            e.target.value = value;
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="productStock">Stock</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="productStock"
                                        placeholder="0.00"
                                        onInput={(e) => {
                                            let value = e.target.value;
                                            value = value.replace(/[^0-9.]/g, "");
                                            value = value.replace(/(\..*)\./g, "$1");
                                            if (value.includes(".")) {
                                                const parts = value.split(".");
                                                parts[1] = parts[1].slice(0, 2);
                                                value = parts.join(".");
                                            }
                                            e.target.value = value;
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="productSKU">SKU</label>
                                    <input type="text" className="form-control" id="productSKU" placeholder="PROD-001" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="productCategory">Categoría</label>
                                    <select className="form-control" id="productCategory">
                                        <option value="">Seleccionar categoría</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="productImage">Imagen del Producto</label>
                                <input type="file" className="form-control" id="productImage" accept="image/*" />
                                <div className="form-text">Formatos: JPG, PNG, GIF. Máx 5MB</div>
                                <div className="image-preview">
                                    <i className="fas fa-image" style={{ color: "var(--gray)" }}></i>
                                </div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" value="" id="checkNativeSwitch" switch="true" />
                                    <label className="form-check-label" htmlFor="checkNativeSwitch">
                                        Artículo no disponible/disponible
                                    </label>
                                </div>
                            </div>

                            <button type="button" className="btn btn-primary btn-block" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i className="fas fa-save"></i> Crear Producto
                            </button>
                        </form>
                    </div>
                </div>

                {/* Modal y lista de productos existentes... */}
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Confirmar Creación</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                ¿Seguro que quieres crear este producto?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" id="confirmCreate" className="btn btn-primary">
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products List */}
                <div className="panel">
                    <div className="panel-header">
                        <h2><i className="fas fa-list"></i> Productos Recientes</h2>
                    </div>
                    <div className="panel-body">
                        <div className="products-grid">
                            <div className="product-card new">
                                <div className="product-header">
                                    <div>
                                        <div className="product-title">Pintura azul</div>
                                        <div className="product-category">Pinturas de agua</div>
                                    </div>
                                    <div className="product-price">$799.00</div>
                                </div>
                                <div className="product-meta">
                                    <div className="product-stock stock-in">
                                        <i className="fas fa-check-circle"></i> Available stock: 25 units
                                    </div>
                                    <div className="product-sku">SKU: PROD-256</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsComponent;