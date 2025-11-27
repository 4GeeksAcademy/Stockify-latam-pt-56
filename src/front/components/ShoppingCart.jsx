import React from "react";
import { ModalShoppingCart } from "./ModalShoppingCart";

export const ShoppingCart = () => {

    return (
        <>
            <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#shoppingCartModal"
            >
                <i className="fa-solid fa-basket-shopping"></i>
            </button>
            {/* Modal */}
            <ModalShoppingCart />
        </>

    )
} 