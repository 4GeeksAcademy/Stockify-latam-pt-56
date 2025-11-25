import React from "react";
import { ProductInList } from "./ProductInList";
import { ProductShoppingCard } from "./ProductShoppingCard";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const ModalShoppingCart = () => {

    const { store } = useGlobalReducer()
    const categories = store.categories || []

    return (
        <div
            className="modal fade"
            id="shoppingCartModal"
            tabIndex={-1}
            aria-labelledby="shoppingCartModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="d-flex justify-content-center align-items-center gap-3 px-3">
                            <i className="fa-solid fa-receipt fs-2"></i>
                            <h5 className="fs-1 fw-bold m-0" id="exampleModalLabel">
                                Create Order
                            </h5>
                        </div>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    {/* Body del Modal */}
                    <div className="modal-body">
                        {/* Parte izquierda del modal */}
                        <div className="row">
                            <div className="col">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="d-flex justify-content-start align-items-center gap-3 px-3 pt-4">
                                            <i className="fa-regular fa-user fs-3 fw-lighter"></i>
                                            <h5 className="fs-3 fw-bold m-0">Client info</h5>
                                        </div>
                                        {/* Input name */}
                                        <div className="d-flex justify-content-center align-items-start px-3 pt-4 flex-column">
                                            <label htmlFor="full_name" className="fs-5 form-label fw-semibold">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="full_name"
                                                placeholder="Enter full name for new user"
                                                required
                                            />
                                        </div>
                                        {/* input address */}
                                        <div className="d-flex justify-content-center align-items-start px-3 pt-4 flex-column">
                                            <label htmlFor="address" className="fs-5 form-label fw-semibold">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="address"
                                                placeholder="Address facturation"
                                                required
                                            />
                                        </div>
                                        {/* Titulo del shopping cart*/}
                                        <div className="d-flex justify-content-start align-items-center gap-3 px-3 pt-5">
                                            <i className="fa-solid fa-cart-arrow-down fs-3"></i>
                                            <h5 className="fs-3 fw-bold m-0">Products in order</h5>
                                        </div>
                                        {/* Productos dentro de la lista */}
                                        <div
                                            className="mt-4 mx-3"
                                            style={{
                                                minHeight: '200px',
                                                padding: '16px',
                                                backgroundColor: 'white',
                                                borderRadius: '12px',
                                                boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
                                            }}
                                        >
                                            <ProductInList />
                                            <ProductInList />
                                            <ProductInList />
                                            <ProductInList />
                                            <ProductInList />
                                            <ProductInList />
                                            <ProductInList />

                                        </div>
                                        {/* Total de la compra */}
                                        <div className="d-flex justify-content-between align-items-center gap-3 px-3 pt-5">
                                            <div className="d-flex justify-content-between align-items-center gap-3">
                                                <i className="fa-solid fa-dollar-sign fs-3 fw-bold"></i>
                                                <h5 className="fs-3 fw-bold m-0">TOTAL AMOUNT:</h5>
                                            </div>
                                            <p className="fs-3 fw-bold">$0.00</p>
                                        </div>

                                    </div>
                                    {/* Parte derecha del modal */}
                                    <div className="col-6">
                                        <div className="d-flex justify-content-start align-items-center gap-3 px-3 pt-4">
                                            <i className="fa-solid fa-magnifying-glass fs-3"></i>
                                            <h5 className="fs-3 fw-bold m-0">Product Catalog</h5>
                                        </div>
                                        <div>
                                            {/* Barra de busqueda */}
                                            <div className="pt-4">
                                                <div className="d-flex justify-content-start align-items-center gap-2">
                                                    <div className="form-group w-50 m-0">
                                                        <input type="text" className="form-control" placeholder="Buscar productos..." />
                                                    </div>
                                                    <div className="m-0">
                                                        <select className="form-control">
                                                            <option value="">Category</option>
                                                            {categories.map((cat) => (
                                                                <option key={cat.id} value={cat.id}>
                                                                    {cat.category_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <button className="btn m-0">
                                                        <i className="fs-6 fas fa-search p-0"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Lista de productos */}
                                            <div className="row g-2 pt-4">
                                                <ProductShoppingCard />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-outline-dark"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                        <button type="button" className="btn btn-outline-warning">
                            Send order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}