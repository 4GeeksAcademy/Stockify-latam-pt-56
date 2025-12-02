// revisar con el grupo, antonio y gustavo

import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../stylesheets/products.css";
import Swal from 'sweetalert2';

const ProductsComponent = () => {
    const { dispatch, store } = useGlobalReducer();
    const userRole = store.userData?.role
    const isAdmin = userRole === 'Administrator'
    const [searchName, setSearchName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const products = store.products;
    const [toggleLoading, setToggleLoading] = useState(null);
    const [editLoading, setEditLoading] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editPrice, setEditPrice] = useState(0);
    const [editStock, setEditStock] = useState(0);
    const [editName, setEditName] = useState("");
    const [editSku, setEditSku] = useState("");
    const [products2, setProducts] = useState([])
    const [productData, setProductData] = useState({
        product_name: "",
        price: "",
        stock: "",
        product_SKU: "",
        category_id: "",
    });

    const handleSearch = async () => {
        setLoading(true);
        let url = `${import.meta.env.VITE_BACKEND_URL}api/products`;
        const params = [];

        // 1. Agregar el nombre de búsqueda
        if (searchName.trim()) {
            params.push(`name=${encodeURIComponent(searchName.trim())}`);
        }

        // 2. Agregar la categoría (solo si se seleccionó algo)
        if (selectedCategory) {
            params.push(`category_id=${selectedCategory}`);
        }

        // 3. Construir la URL final con query parameters
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                dispatch({ type: 'set_products', payload: data.products }) // Actualiza la lista de productos
            } else {
                console.error("Error al buscar productos:", data.msg);
                alert(`Error: ${data.msg}`);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    }

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
            cleanedValue = value; // Ya viene limpio del input, no lo fuerces a número todavía


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
        let priceFloat = parseFloat(productData.price);
        let stockFloat = parseFloat(productData.stock);
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/product`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${store.token}`
                },
                body: JSON.stringify({
                    product_name: productData.product_name,
                    category_id: productData.category_id,
                    price: priceFloat,
                    product_SKU: productData.product_SKU,
                    stock: stockFloat

                })

            });

            const result = await response.json();

            if (response.ok) {
                console.log('Product created successfully!', result.message);
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Producto creado con éxito!',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#667eea'
                });


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
                Swal.fire({
                    title: 'Error!',
                    text: `Error: ${result.msg}`,
                    icon: 'error',
                    confirmButtonText: 'Cool'
                })

                // alert(`Error: ${result.msg}`);
            }
        } catch (error) {
            console.error('SERVER ERROR:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Error del servidor. Revisa la consola.',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            // alert("Error del servidor. Revisa la consola.");
        } finally {
            setLoading(false);
        }
    };

    // FUNCIÓN PARA ACTIVAR/DESACTIVAR PRODUCTO
    /*const toggleProductActive = async (productId, productName, currentStatus) => {
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
    };*/

    const toggleProductActive = async (productId, productName, currentStatus) => {
        const action = currentStatus ? "desactivar" : "activar";
        const actionText = currentStatus ? "desactivado" : "activado";
        const iconColor = currentStatus ? '#f59e0b' : '#10b981';
        const iconType = currentStatus ? 'warning' : 'success';

        const confirmResult = await Swal.fire({
            title: `${currentStatus ? '🔴 Desactivar' : '🟢 Activar'} Producto`,
            html: `
            <div style="text-align: center;">
                <p>¿Estás seguro de que quieres <strong>${action}</strong> el producto?</p>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <strong>"${productName}"</strong>
                </div>
                <small style="color: #6b7280;">
                    ${currentStatus
                    ? 'El producto ya no estará disponible para ventas'
                    : 'El producto estará disponible para ventas'
                }
                </small>
            </div>
        `,
            icon: iconType,
            showCancelButton: true,
            confirmButtonColor: iconColor,
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Sí, ${action}`,
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            focusConfirm: false,
            focusCancel: true
        });

        if (!confirmResult.isConfirmed) {
            await Swal.fire({
                title: 'Acción Cancelada',
                text: `El producto "${productName}" mantiene su estado actual`,
                icon: 'info',
                timer: 2000,
                showConfirmButton: false
            });
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
                        'Authorization': `Bearer ${store.token}`
                    }
                }
            );

            const result = await response.json();

            if (response.ok) {
                await Swal.fire({
                    title: `¡${currentStatus ? '🔴 Desactivado' : '🟢 Activado'}!`,
                    html: `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin: 10px 0;">
                            ${currentStatus ? '❌' : '✅'}
                        </div>
                        <p>El producto <strong>"${productName}"</strong> ha sido</p>
                        <h4 style="color: ${iconColor}; margin: 10px 0;">
                            ${actionText.toUpperCase()}
                        </h4>
                    </div>
                `,
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                    confirmButtonColor: iconColor,
                    timer: 4000,
                    timerProgressBar: true,
                    willClose: () => {
                        fetchProducts(); // Recargar después de cerrar
                    }
                });
            } else {
                await Swal.fire({
                    title: 'Error',
                    html: `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin: 10px 0;">😕</div>
                        <p>${result.msg || `No se pudo ${action} el producto`}</p>
                    </div>
                `,
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#ef4444'
                });
            }
        } catch (error) {
            console.error('Error changing product status:', error);
            await Swal.fire({
                title: 'Error de Conexión',
                html: `
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin: 10px 0;">📡</div>
                    <p>No se pudo conectar con el servidor</p>
                    <small style="color: #6b7280;">Verifica tu conexión a internet</small>
                </div>
            `,
                icon: 'error',
                confirmButtonText: 'Reintentar',
                confirmButtonColor: '#ef4444'
            });
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
                        'Authorization': `Bearer ${store.token}`
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
    }
    // const updateProduct = async (productId, productName) => {
    //     if (!editPrice || isNaN(editPrice) || parseFloat(editPrice) < 0) {
    //         await Swal.fire({
    //             title: 'Precio Inválido',
    //             text: 'Por favor ingresa un precio válido (mayor o igual a 0)',
    //             icon: 'warning',
    //             confirmButtonText: 'Entendido',
    //             confirmButtonColor: '#f59e0b'
    //         });
    //         return;
    //     }

    //     if (!editStock || isNaN(editStock) || editStock < 0) {
    //         await Swal.fire({
    //             title: 'Stock Inválido',
    //             text: 'Por favor ingresa un stock válido (mayor o igual a 0)',
    //             icon: 'warning',
    //             confirmButtonText: 'Entendido',
    //             confirmButtonColor: '#f59e0b'
    //         });
    //         return;
    //     }

    //     if (!editSku) {
    //         await Swal.fire({
    //             title: 'Sku Inválido',
    //             text: 'Por favor ingresa un Sku válido',
    //             icon: 'warning',
    //             confirmButtonText: 'Entendido',
    //             confirmButtonColor: '#f59e0b'
    //         });
    //         return;
    //     }
    //     if (!editName || editName.trim() === "") {
    //         await Swal.fire({
    //             title: 'Nombre Inválido',
    //             text: 'Por favor ingresa un nombre válido',
    //             icon: 'warning',
    //             confirmButtonText: 'Entendido',
    //             confirmButtonColor: '#f59e0b'
    //         });
    //         return;
    //     }





    //     const newPrice = parseFloat(editPrice);
    //     const oldPrice = editingProduct ? parseFloat(editingProduct.price) : 0;

    //     const newStock = parseFloat(editStock);
    //     const oldStock = editingProduct ? parseFloat(editingProduct.stock) : 0;

    //     const newName = editName.trim();

    //     const oldName = editingProduct ? (editingProduct.product_name) : "";


    //     const newSku = parseFloat(editSku);
    //     const oldSku = editingProduct ? parseFloat(editingProduct.product_SKU) : 0;

    //     const confirmResult = await Swal.fire({
    //         title: '🔄 Actualizar Producto',
    //         html: `
    //         <div style="text-align: center;">
    //             <p>¿Estás seguro de que quieres actualizar el precio de?</p>
    //             <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0;">
    //                 <strong>"${productName}"</strong>
    //             </div>
    //             <div style="display: flex; justify-content: center; gap: 20px; margin: 15px 0;">
    //                 <div style="text-align: center;">
    //                     <small style="color: #6b7280;">Precio Actual</small>
    //                     <div style="color: #ef4444; font-weight: bold; font-size: 1.2rem;">
    //                         $${oldPrice.toFixed(2)}
    //                     </div>
    //                 </div>
    //                 <div style="align-self: center;">
    //                     <i class="fas fa-arrow-right" style="color: #6b7280;"></i>
    //                 </div>
    //                 <div style="text-align: center;">
    //                     <small style="color: #6b7280;">Nuevo Precio</small>
    //                     <div style="color: #10b981; font-weight: bold; font-size: 1.2rem;">
    //                         $${newPrice.toFixed(2)}
    //                     </div>
    //                 </div>
    //             </div>
    //             <small style="color: #6b7280;">
    //                 ${newPrice > oldPrice ? '📈 Aumento de precio' : newPrice < oldPrice ? '📉 Disminución de precio' : '🟰 Mismo precio'}
    //             </small>

    //         </div>
    //     `,
    //         icon: 'question',
    //         showCancelButton: true,
    //         confirmButtonColor: '#10b981',
    //         cancelButtonColor: '#6b7280',
    //         confirmButtonText: 'Sí, actualizar',
    //         cancelButtonText: 'Cancelar',
    //         reverseButtons: true,
    //         focusConfirm: false,
    //         focusCancel: true
    //     });

    //     if (!confirmResult.isConfirmed) {
    //         await Swal.fire({
    //             title: 'Actualización Cancelada',
    //             text: `El precio de "${productName}" se mantiene en $${oldPrice.toFixed(2)}`,
    //             icon: 'info',
    //             timer: 2000,
    //             showConfirmButton: false
    //         });
    //         return;
    //     }

    //     try {
    //         setEditLoading(productId);
    //         const response = await fetch(
    //             `${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}`,
    //             {
    //                 method: 'PUT',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${store.token}`
    //                 },
    //                 body: JSON.stringify({
    //                     stock: newStock,
    //                     sku: newSku,
    //                     name: newName,
    //                     price: newPrice
    //                 })
    //             }
    //         );




    //         const result = await response.json();

    //         if (response.ok) {
    //             await Swal.fire({
    //                 title: '¡Precio Actualizado!',
    //                 html: `
    //                 <div style="text-align: center;">
    //                     <div style="font-size: 3rem; color: #10b981; margin: 10px 0;">
    //                         ✅
    //                     </div>
    //                     <p>El precio de <strong>"${productName}"</strong> ha sido actualizado</p>
    //                     <div style="display: flex; justify-content: center; gap: 20px; margin: 15px 0;">
    //                         <div style="text-decoration: line-through; color: #ef4444;">
    //                             $${oldPrice.toFixed(2)}
    //                         </div>
    //                         <div style="font-weight: bold; color: #10b981; font-size: 1.3rem;">
    //                             $${newPrice.toFixed(2)}
    //                         </div>  
    //                     </div>
    //                 </div>
    //             `,
    //                 icon: 'success',
    //                 confirmButtonText: 'Continuar',
    //                 confirmButtonColor: '#10b981',
    //                 timer: 4000,
    //                 timerProgressBar: true,
    //                 willClose: () => {
    //                     fetchProducts();
    //                     const modal = bootstrap.Modal.getInstance(document.getElementById("editPriceModal"));
    //                     modal.hide();
    //                     setEditingProduct(null);
    //                     setEditPrice("");
    //                 }
    //             });
    //         } else {
    //             await Swal.fire({
    //                 title: 'Error al Actualizar',
    //                 html: `
    //                 <div style="text-align: center;">
    //                     <div style="font-size: 3rem; margin: 10px 0;">😕</div>
    //                     <p>${result.msg || 'No se pudo actualizar el precio del producto'}</p>
    //                 </div>
    //             `,
    //                 icon: 'error',
    //                 confirmButtonText: 'Entendido',
    //                 confirmButtonColor: '#ef4444'
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error updating product price:', error);
    //         await Swal.fire({
    //             title: 'Error de Conexión',
    //             html: `
    //             <div style="text-align: center;">
    //                 <div style="font-size: 3rem; margin: 10px 0;">📡</div>
    //                 <p>No se pudo conectar con el servidor</p>
    //                 <small style="color: #6b7280;">Verifica tu conexión a internet</small>
    //             </div>
    //         `,
    //             icon: 'error',
    //             confirmButtonText: 'Reintentar',
    //             confirmButtonColor: '#ef4444'
    //         });
    //     } finally {
    //         setEditLoading(null);
    //     }
    // };

    // FUNCIÓN PARA ABRIR MODAL DE EDICIÓN

    const openEditModal = (product) => {
        setEditingProduct(product);
        setEditPrice(product.price.toString());
        setEditStock(product.stock.toString());
        setEditSku(product.product_SKU.toString());
        setEditName(product.product_name.toString());
        console.log("Editing Product:", product);
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    useEffect(() => {
        // Dispara la función de búsqueda cada vez que la categoría 
        // seleccionada cambia.

        // 💡 CONSEJO: También podrías incluir 'searchName' para que 
        // la búsqueda se active al escribir, si lo deseas.
        // Si incluyes 'categories.length', asegúrate de que no cause doble 
        // llamada al inicio si 'fetchProducts' ya está en el primer useEffect.

        // Ejecutamos la búsqueda. El primer montaje también lo ejecutará.
        handleSearch();

    }, [selectedCategory, searchName])


    return (
        <div id="products-tab" className="tab-content active">
            {/* Search and Filters*/}
            <div className="search-section">
                <div className="d-flex align-items-center justify-content-center gap-2">

                    <input type="text" className="form-control m-0" placeholder="Buscar productos..." value={searchName} onChange={(e) => setSearchName(e.target.value)} />

                    <div className="form-group filter-select m-0">
                        <select className="form-control" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="">Seleccionar categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-primary" disabled={loading} onClick={handleSearch}>
                        <i className="fas fa-search"></i> Buscar
                    </button>
                </div>
            </div>

            <div className="col d-flex gap-2">
                {/* Create Product Panel */}
                {isAdmin && (
                    <div className="panel col-6 h-50">
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
                                <button type="button" className="btn btn-primary btn-block" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <i className="fas fa-save"></i> Crear Producto
                                </button>
                            </form>
                        </div>
                    </div>

                )}

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
                <div className="col panel">
                    <div className="panel-header">
                        <h2><i className="fas fa-list"></i> Lista de productos</h2>
                    </div>
                    <div className="panel-body scrollable-products mb-3" style={{ overflowY: "auto", maxHeight: "90vh" }}>
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


                                            {isAdmin && (
                                                <div className="product-actions d-flex gap-2 mt-2">
                                                    {/* Botón para editar precio */}
                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#editPriceModal"
                                                        onClick={() => openEditModal(product)}
                                                    >
                                                        <i className="fas fa-edit me-1"></i>
                                                        Editar
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
                                            )}
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