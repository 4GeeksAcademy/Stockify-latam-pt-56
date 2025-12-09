import React from "react";
import { ModalShoppingCart } from "./ModalShoppingCart";

export const ShoppingCart = () => {

    return (
        <>
            <button
                type="button"
                
                className="btn btn-primary fw-bold"
                data-bs-toggle="modal"
                data-bs-target="#shoppingCartModal"
            >
                <div className="d-flex align-items-center gap-2">
                    {/* Ícono de recibo/documento */}
                    <i className="fa-solid fa-file-invoice"></i>

                    Order
                </div>
            </button>
            {/* Modal */}
            <ModalShoppingCart />
        </>

    )
} 