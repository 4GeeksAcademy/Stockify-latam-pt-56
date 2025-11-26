
// revisar con el grupo, antonio y gustavo

import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

const ProductsComponent = () => {
    const { dispatch, store } = useGlobalReducer();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const products = store.products;
    const [deleteLoading, setDeleteLoading] = useState(null)
    const [productData, setProductData] = useState({
        product_name: "",
        price: "",
        stock: "",
        product_SKU: "",
        category_id: "",
        // product_image: null, // Puedes manejar la imagen por separado si es un file
    })


    const handleInputChange = (e) => {
        const { id, value } = e.target;
        // Mapea los IDs de los inputs a las claves del objeto productData
        const nameMap = {
            productName: "product_name",
            productPrice: "price",
            productStock: "stock",
            productSKU: "product_SKU",
            productCategory: "category_id",
        };

        const fieldName = nameMap[id] || id;

        // Limpieza de valores (ej: convertir a número si es necesario)
        let cleanedValue = value;

        if (fieldName === "price" || fieldName === "stock") {
            // Asegurar que category_id sea un número (si es un select)
            cleanedValue = parseFloat(value) || 0; // O usar Number(value) para stock si es un entero estricto
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
                dispatch({ type: 'set_products', payload: result.products })
            } else {
                console.error('Error al cargar productos:', result.msg);
            }
        } catch (error) {
            console.error('Error del servidor al cargar productos:', error);
        }
    }

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

    const createProduct = async () => {
        setLoading(true); // Opcional: Para mostrar un spinner

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/product`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Incluye headers de autenticación si son necesarios (ej: 'Authorization': `Bearer ${token}`)
                },
                // productData contiene las 5 claves que espera tu endpoint:
                // product_name, price, stock, product_SKU, category_id
                body: JSON.stringify(productData),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Product created successfully!', result.message);
                alert("Producto creado con éxito!"); // Usar una notificación real

                // Limpiar formulario y cerrar modal después de la creación exitosa
                setProductData({
                    product_name: "",
                    price: "",
                    stock: "",
                    product_SKU: "",
                    category_id: "",
                });

                // CERRAR MODAL
                const modalElement = document.getElementById("exampleModal");
                if (modalElement) {
                    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                    modal.hide();
                }

            } else {
                console.error('Error creating product:', result.msg);
                alert(`Error: ${result.msg}`); // Mostrar el error del backend
            }

        } catch (error) {
            console.error('SERVER ERROR:', error);
            alert("Error del servidor. Revisa la consola.");
        } finally {
            setLoading(false);
        }
    }
    const deleteProduct = async (productId, productName){
        if (!confirm(`Estás seguro de que quieres eliminar el producto"${productName}"?`)) {
            return;
        }
        try {
            setDeleteLoading(productId);
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            const result = await response.json();
            if (response.ok) {
                alert('Producto eliminado exitosamente');
                fetchProducts(); // Recargar la lista
            } else {
                alert(`Error: ${result.msg || 'No se pudo eliminar el producto'}`);
            }
        }
        catch {
            console.error('Error deleting product:', error);
            alert('Error de conexión al servidor');
        }
        finally {
            setDeleteLoading(null);
        }
    };

    useEffect(() => {
        fetchCategories()
        fetchProducts()
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
                                <button type="button" id="confirmCreate" className="btn btn-primary" onClick={createProduct} disabled={loading}>
                                    {loading ? 'Creando...' : 'Confirmar'}
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
                                // Mapeamos sobre la lista de productos
                                products.map((product) => (
                                    <div className="product-card new" key={product.id}>
                                        <div className="product-header">
                                            <div>
                                                {/* Mostrar el nombre del producto */}
                                                <div className="product-title">{product.product_name}</div>

                                                {/* Nota: Para mostrar el nombre de la categoría, 
                                necesitarías mapear product.category_id al nombre 
                                usando el estado 'categories' o traer la categoría serializada en el GET.
                                Por ahora, dejaremos el ID o un placeholder. */}
                                                <div className="product-category">Category: {product.category.category_name}</div>
                                            </div>
                                            {/* Mostrar el precio del producto */}
                                            <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
                                        </div>
                                        <div className="product-meta">
                                            <div className={`product-stock ${product.stock > 0 ? 'stock-in' : 'stock-out'}`}>
                                                {/* Mostrar el stock */}
                                                <i className="fas fa-check-circle"></i> Available stock: {product.stock} units
                                            </div>
                                            {/* Mostrar el SKU del producto */}
                                            <div className="product-sku">SKU: {product.product_SKU}</div>
                                        </div>
                                        <div className="product-actions mt-3 pt-3 border-top">
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteProduct(product.id, product.product_name)}
                                                disabled={deleteLoading === product.id}
                                            >
                                                {deleteLoading === product.id ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                        Eliminando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-trash me-1"></i>
                                                        Eliminar Producto
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Mensaje si no hay productos
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