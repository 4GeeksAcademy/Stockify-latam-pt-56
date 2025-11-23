import React from "react";

export const ProductInList = () => {

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <div className="py-3">
                    <p className="fs-6 fw-bold text-start m-0">Product name</p>
                    <p className="fs-6 text-start fw-lighter m-0">Price: 0.10$</p>
                </div>
                <div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <button className="btn m-0"><i className="fa-solid fa-plus"></i></button>
                            <p className="fs-6 fw-lighter m-0">10</p>
                            <button className="btn m-0"><i className="fa-solid fa-minus"></i></button>
                        </div>
                        <p className="fs-6 fw-bold m-0">$0.00</p>
                    </div>


                </div>
            </div>
        </>
    )
}