import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ProductShoppingCard = () => {
    const { dispatch, store } = useGlobalReducer()
    const products = store.products

    const handleAddProduct = (product) => {
        dispatch({
            type: "ADD_PRODUCT_TO_CART",
            payload: product
        });
    }

    if (!products || products.length === 0) {
        return (
            <div className="col pt-4">
                <p className="text-center text-muted">No hay productos disponibles para añadir al carrito.</p>
            </div>
        )
    }

    return (
        <>
            {products.map((product) => (
                <div key={product.id} className="col-6 mb-4">
                    <div
                        className="d-flex flex-column shadow-sm p-3 bg-white rounded w-100 h-100"
                    >
                        <div className="d-flex justify-content-between align-items-start w-100">
                            <div className="d-flex flex-column align-items-start">
                                <p className="fs-5 fw-bold">{product.product_name}</p>
                                <p className="fs-6 fw-lighter">
                                    Stock: {product.stock} unidades
                                </p>
                            </div>
                            <div className="text-end">
                                <p className="fw-bold fs-5">${parseFloat(product.price).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="mt-auto pt-2 text-end">
                            <button className="btn btn-outline-warning rounded-4 p-2" onClick={() => handleAddProduct(product)}>
                                <i className="fa-solid fa-plus"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}