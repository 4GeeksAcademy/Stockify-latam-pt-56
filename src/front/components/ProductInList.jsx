import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ProductInList = () => {

    const { store } = useGlobalReducer()
    const cartItems = store?.cart || []

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-4 text-muted">
                No hay productos en la orden. Agrega productos del catálogo.
            </div>
        );
    }
    return (
        <>
            {cartItems.map((item) => (
                <div
                    // Usar la ID del producto como key única
                    key={item.product.id}
                    className="d-flex justify-content-between align-items-center py-2 border-bottom border-light"
                >
                    <div className="py-1">
                        {/* Nombre del producto */}
                        <p className="fs-6 fw-bold text-start m-0">{item.product.product_name}</p>
                    </div>
                    <div>
                        <div className="d-flex justify-content-between align-items-center gap-2">
                            <div className="d-flex align-items-center gap-2">
                                {/* Botón para restar cantidad */}
                                <button className="btn btn-sm btn-outline-danger border-0 rounded-pill py-0 px-2 m-0 me-1">
                                    <i className="fa-solid fa-minus"></i>
                                </button>

                                {/* Cantidad actual del item */}
                                <p className="fs-6 fw-lighter m-0">{item.quantity}</p>

                                {/* Botón para sumar cantidad */}
                                <button className="btn btn-sm btn-outline-success border-0 rounded-pill py-0 px-2 m-0 ms-1">
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>

                            {/* Cálculo del Subtotal del item */}
                            <p className="fs-6 fw-bold m-0">
                                ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}