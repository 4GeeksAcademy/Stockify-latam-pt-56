import React from "react";
import { Link } from "react-router-dom";
import "./presentation.css";

const Home = () => {
    return (
        <div className="bg-black text-white w-100" style={{ minHeight: "100vh" }}>
            {/* NAVBAR */}
            <nav
                className="navbar navbar-expand-lg shadow-sm"
                style={{ backgroundColor: "#000000", borderBottom: "4px solid #b8860b" }}
            >
                <div className="container-fluid">
                    <Link className="navbar-brand fw-bold text-white" to="/" style={{ fontSize: "1.2rem" }}>
                        Stockify
                    </Link>

                    <button
                        className="navbar-toggler bg-light"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item me-2">
                                <Link className="btn btn-success btn-sm" to="/login">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* CONTENIDO PRINCIPAL */}
            <div className="home-container container py-5">

                {/* HERO */}
                <section className="hero text-center mb-5">
                    <div className="hero-text">
                        <h1 className="text-warning fw-bold display-4">Stockify</h1>
                        <p className="lead">
                            La solución inteligente para la gestión de inventarios, ventas y usuarios.
                        </p>
                    </div>
                </section>

                {/* PROBLEMA */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold">¿Por qué es útil nuestro producto?</h2>
                    <p>
                        Los negocios minoristas pierden tiempo, dinero y clientes por una mala gestión del inventario.
                    </p>
                    <p className="fw-semibold">
                        Sin una herramienta adecuada, los negocios enfrentan desorganización, poca productividad y baja capacidad de crecimiento.
                    </p>
                </section>

                {/* SOLUCIÓN */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold">¿Cómo lo resolvemos?</h2>
                    <ul>
                        <li>Organización eficiente del inventario.</li>
                        <li>Datos actualizados en tiempo real.</li>
                        <li>Gestión centralizada de productos, compras y usuarios.</li>
                        <li>Automatización de tareas repetitivas.</li>
                        <li>Soporte para decisiones inteligentes.</li>
                    </ul>
                </section>

                {/* FUNCIONALIDADES ACTUALES */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold">Funcionalidades Actuales</h2>
                    <div className="d-flex flex-wrap gap-3">
                        <div className="border border-warning p-2 rounded">Gestión de Usuarios</div>
                        <div className="border border-warning p-2 rounded">Gestión de Productos</div>
                        <div className="border border-warning p-2 rounded">Carrito y Compras</div>
                        <div className="border border-warning p-2 rounded">Dashboard Estadístico</div>
                    </div>
                </section>

                {/* DETALLE PRODUCTOS */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold">Gestión de Productos</h2>
                    <ul>
                        <li>Crear productos con formulario limpio y validaciones</li>
                        <li>Cargar imágenes y detalles específicos</li>
                        <li>Clasificar por categorías (materiales, químicos, etc.)</li>
                        <li>Botón de carrito e integración de modal especializado</li>
                    </ul>
                </section>

                {/* CATÁLOGO */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold">Catálogo y Carrito de Compras</h2>
                    <ul>
                        <li>Modal ShoppingCart</li>
                        <li>Cantidades, precios unitarios y total automático</li>
                        <li>Botón checkout</li>
                    </ul>
                </section>

                {/* DASHBOARD */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold">Dashboard</h2>
                    <ul>
                        <li>Visualización general del stock</li>
                        <li>Cantidad de productos</li>
                        <li>Alertas de bajo inventario</li>
                        <li>Estadísticas básicas</li>
                    </ul>
                </section>

                {/* FUTURAS */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold">Funcionalidades Futuras</h2>
                    <ul>
                        <li> El administrador podrá recibir un correo cuando se cree una orden de compra </li>
                        <li>El administrador verá los vendedores disponibles para organizarlos mejor</li>
                        <li>El administrador podrá ver el total del inventario</li>
                        <li>El administrador verá un reporte con todos los pedidos finalizados</li>
                        <li>El administrador cargará la existencia de productos</li>
                        <li>El vendedor podrá registrarse en la plataforma</li>
                        <li>Los vendedores podrán reservar productos</li>
                    </ul>
                </section>

                {/* BENEFICIOS */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold">Beneficios del Producto</h2>
                    <ul>
                        <li>Ahorro de tiempo y control automatizado</li>
                        <li>Información centralizada y precisa</li>
                        <li>Mejora la gestión del inventario y compras</li>
                        <li>Pagos, ventas y usuarios centralizados</li>
                    </ul>
                </section>

                {/* PÚBLICO OBJETIVO */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold">Público Objetivo</h2>
                    <ul>
                        <li>Ferreterías y tiendas minoristas</li>
                        <li>Distribuidores de materiales y PyMEs</li>
                        <li>Negocios interesados en control eficiente de inventario</li>
                    </ul>
                </section>

                {/* EQUIPO */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold">Creadores del Proyecto</h2>
                    
                    <div className="d-flex justify-content-center gap-4">
                        <div className="text-center">
                            <div className="bg-secondary mb-2 rounded" style={{ width: "150px", height: "180px" }}>Foto 1</div>
                            <p className="text-warning">Nombre integrante 1</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-secondary mb-2 rounded" style={{ width: "150px", height: "180px" }}>Foto 2</div>
                            <p className="text-warning">Nombre integrante 2</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-secondary mb-2 rounded" style={{ width: "150px", height: "180px" }}>Foto 3</div>
                            <p className="text-warning">Nombre integrante 3</p>
                        </div>
                    </div>
                </section>

                
                <section className="section-box p-4 mb-4 border border-warning rounded text-center">
                    <p>
                        <strong>
                            Stockify es más que una aplicación de inventario, es la herramienta que estabas buscando para mejorar tus ventas,
                            tomar decisiones inteligentes, reducir pérdidas y automatizar la operación.
                        </strong>
                    </p>
                    <p>¿Qué esperas? Cotizamos tu solución ideal.</p>
                </section>
            </div>

            {/* FOOTER */}
            <footer
                className="text-center py-4 mt-5"
                style={{ backgroundColor: "#000000", borderTop: "4px solid #b8860b" }}
            >
                <p className="mb-1 text-white">© 2025 Stockify. Todos los derechos reservados.</p>
                <p className="text-warning">Impulsando negocios inteligentes</p>
            </footer>
        </div>
    );
};

export default Home;
