// revisar con el grupo, antonio y gustavo

import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../stylesheets/products.css";

const ProductsComponent = () => {
    const { dispatch, store } = useGlobalReducer();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const products = store.products;
    const [toggleLoading, setToggleLoading] = useState(null);
    const [editLoading, setEditLoading] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editPrice, setEditPrice] = useState("");
    const [productData, setProductData] = useState({
        product_name: "",
        price: "",
        stock: "",
        product_SKU: "",
        category_id: "",
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const nameMap = {
            productName: "product_name",
            productPrice: "price",
            productStock: "stock",
            productSKU: "product_SKU",
            productCategory: "category_id",
        };

        const fieldName = nameMap[id] || id;
        let cleanedValue = value;

        if (fieldName === "price" || fieldName === "stock") {
            cleanedValue = parseFloat(value) || 0;
        } else if (fieldName === "category_id") {
            cleanedValue = Number(value);
        }

        setProductData((prevData) => ({
            ...prevData,
            [fieldName]: cleanedValue,
        }));
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
            const result = await response.json();

            if (response.ok) {
                dispatch({ type: 'set_products', payload: result.products });
            } else {
                console.error('Error al cargar productos:', result.msg);
            }
        } catch (error) {
            console.error('Error del servidor al cargar productos:', error);
        }
    };

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

    const createProduct = async () => {
        setLoading(true);
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/product`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Product created successfully!', result.message);
                alert("Producto creado con éxito!");
                setProductData({
                    product_name: "",
                    price: "",
                    stock: "",
                    product_SKU: "",
                    category_id: "",
                });

                const modalElement = document.getElementById("exampleModal");
                if (modalElement) {
                    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                    modal.hide();
                }
                fetchProducts();
            } else {
                console.error('Error creating product:', result.msg);
                alert(`Error: ${result.msg}`);
            }
        } catch (error) {
            console.error('SERVER ERROR:', error);
            alert("Error del servidor. Revisa la consola.");
        } finally {
            setLoading(false);
        }
    };

    // FUNCIÓN PARA ACTIVAR/DESACTIVAR PRODUCTO
    const toggleProductActive = async (productId, productName, currentStatus) => {
        const action = currentStatus ? "desactivar" : "activar";

        if (!confirm(`¿Estás seguro de que quieres ${action} el producto "${productName}"?`)) {
            return;
        }

        try {
            setToggleLoading(productId);
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}/toggle-active`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            const result = await response.json();

            if (response.ok) {
                alert(`Producto ${action}do exitosamente`);
                fetchProducts();
            } else {
                alert(`Error: ${result.msg || 'No se pudo cambiar el estado del producto'}`);
            }
        } catch (error) {
            console.error('Error changing product status:', error);
            alert('Error de conexión al servidor');
        } finally {
            setToggleLoading(null);
        }
    };

    // FUNCIÓN PARA ACTUALIZAR PRECIO DEL PRODUCTO
    const updateProductPrice = async (productId, productName) => {
        if (!editPrice || isNaN(editPrice) || parseFloat(editPrice) < 0) {
            alert("Por favor ingresa un precio válido");
            return;
        }

        try {
            setEditLoading(productId);
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        price: parseFloat(editPrice)
                    })
                }
            );

            const result = await response.json();

            if (response.ok) {
                alert('Precio actualizado exitosamente');
                fetchProducts();
                const modal = bootstrap.Modal.getInstance(document.getElementById("editPriceModal"));
                modal.hide();
                setEditingProduct(null);
                setEditPrice("");
            } else {
                alert(`Error: ${result.msg || 'No se pudo actualizar el precio'}`);
            }
        } catch (error) {
            console.error('Error updating product price:', error);
            alert('Error de conexión al servidor');
        } finally {
            setEditLoading(null);
        }
    };

    // FUNCIÓN PARA ABRIR MODAL DE EDICIÓN
    const openEditModal = (product) => {
        setEditingProduct(product);
        setEditPrice(product.price.toString());
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
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
                                <input type="text" className="form-control" id="productName" placeholder="Ej: iPhone 14 Pro" value={productData.product_name} onChange={handleInputChange} />
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
                                        value={productData.price}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="productStock">Stock</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="productStock"
                                        placeholder="0"
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
                                        value={productData.stock}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="productSKU">SKU</label>
                                    <input type="text" className="form-control" id="productSKU" placeholder="PROD-001" value={productData.product_SKU} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="productCategory">Categoría</label>
                                    <select className="form-control" id="productCategory" value={productData.category_id} onChange={handleInputChange}>
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

                {/* Modal para Crear Producto */}
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
                                <button type="button" id="confirmCreate" className="btn btn-primary" onClick={createProduct} disabled={loading}>
                                    {loading ? 'Creando...' : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal para Editar Precio */}
                <div className="modal fade" id="editPriceModal" tabIndex="-1" aria-labelledby="editPriceModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="editPriceModalLabel">
                                    Editar Precio del Producto
                                </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {editingProduct && (
                                    <>
                                        <p>
                                            Editando precio para: <strong>{editingProduct.product_name}</strong>
                                        </p>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="editPrice">
                                                Nuevo Precio ($)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="form-control"
                                                id="editPrice"
                                                value={editPrice}
                                                onChange={(e) => setEditPrice(e.target.value)}
                                                placeholder="0.00"
                                            />
                                            <div className="form-text">
                                                Ingresa el nuevo precio para este producto
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <small className="text-muted">
                                                Precio actual: <strong>${parseFloat(editingProduct.price).toFixed(2)}</strong>
                                            </small>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={() => updateProductPrice(editingProduct.id, editingProduct.product_name)}
                                    disabled={editLoading === editingProduct?.id || !editPrice}
                                >
                                    {editLoading === editingProduct?.id ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Actualizando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-1"></i>
                                            Guardar Cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products List */}
                <div className="panel">
                    <div className="panel-header">
                        <h2><i className="fas fa-list"></i> Lista de productos</h2>
                    </div>
                    <div className="panel-body">
                        <div className="products-grid">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <div className={`product-card ${!product.is_active ? 'product-inactive' : ''}`} key={product.id}>
                                        <div className="product-header">
                                            <div>
                                                <div className="product-title">
                                                    {product.product_name}
                                                    {!product.is_active && (
                                                        <span className="badge bg-danger ms-2">Inactivo</span>
                                                    )}
                                                </div>
                                                <div className="product-category">Categoría: {product.category?.category_name || 'Sin categoría'}</div>
                                            </div>
                                            <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
                                        </div>
                                        <div className="product-meta">
                                            <div className={`product-stock ${product.stock > 0 ? 'stock-in' : 'stock-out'}`}>
                                                <i className={`fas ${product.stock > 0 ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                                                Stock: {product.stock} unidades
                                            </div>
                                            <div className="product-sku">SKU: {product.product_SKU}</div>
                                        </div>
                                        <div className="product-actions mt-3 pt-3 border-top">
                                            <div className="d-flex gap-2 flex-wrap">
                                                {/* Botón Editar Precio */}
                                                <button
                                                    className="btn btn-warning btn-sm"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#editPriceModal"
                                                    onClick={() => openEditModal(product)}
                                                >
                                                    <i className="fas fa-edit me-1"></i>
                                                    Editar Precio
                                                </button>

                                                {/* Botón Activar/Desactivar */}
                                                <button
                                                    className={`btn btn-sm ${product.is_active ? 'btn-secondary' : 'btn-success'}`}
                                                    onClick={() => toggleProductActive(product.id, product.product_name, product.is_active)}
                                                    disabled={toggleLoading === product.id}
                                                >
                                                    {toggleLoading === product.id ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                            {product.is_active ? 'Desactivando...' : 'Activando...'}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className={`fas ${product.is_active ? 'fa-eye-slash' : 'fa-eye'} me-1`}></i>
                                                            {product.is_active ? 'Desactivar' : 'Activar'}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay productos registrados.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsComponent;