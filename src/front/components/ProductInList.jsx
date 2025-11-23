import React, { useEffect, useState } from "react";

export const ProductInList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Función para hacer la petición a la API
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            // Asegúrate de que VITE_BACKEND_URL esté definido o usa la URL base correcta
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);

            if (!response.ok) {
                // Si la respuesta no es 2xx, lanza un error
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // 3. Guarda la lista de productos en el estado local
            setProducts(data.products || []);

        } catch (err) {
            console.error("Error fetching products:", err);
            setError("No se pudieron cargar los productos.");
        } finally {
            setLoading(false);
        }
    };

    // 4. Ejecutar la petición al montar el componente
    useEffect(() => {
        fetchProducts();
    }, []);

    // 5. Mostrar un estado de carga o error
    if (loading) {
        return <div className="text-center py-4 text-muted">Cargando productos...</div>;
    }

    if (error) {
        return <div className="text-center py-4">Error: {error}</div>;
    }

    // 6. Usar el primer producto para simular la visualización
    const firstProduct = products[0];


    return (
        <>
            {/* Si no hay productos, mostrar un mensaje */}
            {products.length === 0 ? (
                <div className="text-center py-4 text-muted">No hay productos disponibles.</div>
            ) : (
                <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                    <div className="py-1">
                        {/* Muestra el nombre y precio del primer producto */}
                        <p className="fs-6 fw-bold text-start m-0">{firstProduct.product_name || "Nombre de Producto"}</p>
                        <p className="fs-6 text-start fw-lighter m-0">Price: ${firstProduct.price ? firstProduct.price.toFixed(2) : "0.00"}</p>
                    </div>
                    <div>
                        <div className="d-flex justify-content-between align-items-center gap-2">
                            <div className="d-flex align-items-center gap-2">
                                <button className="btn btn-sm btn-outline-success border-0 rounded-pill py-0 px-2 m-0 ms-1"><i className="fa-solid fa-plus"></i></button>
                                <p className="fs-6 fw-lighter m-0">1</p> {/* Cantidad de prueba */}
                                <button className="btn btn-sm btn-outline-danger border-0 rounded-pill py-0 px-2 m-0 me-1"><i className="fa-solid fa-minus"></i></button>
                            </div>
                            <p className="fs-6 fw-bold m-0">$0.00</p> {/* Subtotal de prueba */}
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}