import React from "react";

export const ProductShoppingCard = () => {

    return (
        <div className="col pt-4">
            <div className="d-flex justify-content-between shadow-sm p-3 mb-5 bg-white rounded w-100">
                <div className="d-flex flex-column align-items-start">
                    <p className="fs-5 fw-bold">Product</p>
                    <p className="fs-6 fw-lighter">Stock</p>
                </div>
                <div className="">
                    <p className="fw-bold fs-5">$200.00</p>
                    <button className="btn btn-outline-warning rounded-4">
                        <i className="fa-solid fa-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    )
}