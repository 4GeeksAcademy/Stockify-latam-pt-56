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

                {/* TÍTULO Y SLOGAN */}
                <section className="hero text-center mb-5">
                    <div className="hero-text">
                        <h1 className="text-warning fw-bold display-4">Stockify</h1>
                        <p className="lead">
                            La solución inteligente para la gestión de inventarios, ventas y usuarios.
                        </p>
                    </div>
                </section>

                {/* UTILIDAD DE STOCKIFY */}
                <section className="section-box p-4 mb-4 border border-warning rounded ">
                    <h2 className="text-warning fw-semibold text-center">¿Por qué es útil nuestro producto?</h2>
                    <p>
                        Los negocios minoristas pierden tiempo, dinero y clientes por una mala gestión del inventario.
                    </p>
                    <p className="fw-semibold">
                        Además, sin una herramienta adecuada, los negocios enfrentan desorganización, poca productividad y baja capacidad de crecimiento.
                    </p>
                </section>

                {/*NUESTRA SOLUCIÓN */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold text-center">¿Cómo lo resolvemos?</h2>
                    <ul>
                        <li>Con una organización eficiente del inventario.</li>
                        <li>Con una app que proporcione datos actualizados y en tiempo real.</li>
                        <li>No olvidemos la importancia de una gestión centralizada de productos, compras y usuarios.</li>
                        <li>Stockify cuenta también con automatización de tareas repetitivas.</li>
                        <li> Y como bonus, un soporte para decisiones inteligentes.</li>
                    </ul>
                </section>

                {/* FUNCIONALIDADES ACTUALES */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold text-center">Funcionalidades Actuales</h2>
                    <div className="d-flex flex-wrap gap-3">
                        <div className="border border-warning p-2 rounded">Gestión de Usuarios</div>
                        <div className="border border-warning p-2 rounded">Gestión de Productos</div>
                        <div className="border border-warning p-2 rounded">Stockify te provee un carrito de compras</div>
                        <div className="border border-warning p-2 rounded">Dashboard con estadístiscas siempre disponibles</div>
                        <div className="border border-warning p-2 rounded">Cantidades, precios unitarios y total automático</div>
                        <div className="border border-warning p-2 rounded">El administrador verá los vendedores disponibles para organizarlos mejor</div>
                        <div className="border border-warning p-2 rounded">El administrador cargará productos</div>
                        <div className="border border-warning p-2 rounded">El vendedor podrá registrarse en la plataforma</div>



                    </div>
                </section>

                {/* DETALLE DE LA GESTIÓN DE PRODUCTOS  */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold text-center">Gestión de Productos</h2>
                    <ul>
                        <li>Crear productos con formulario</li>
                        <li>Cargar imágenes y detalles específicos</li>
                        <li>Clasificar por categorías (materiales, químicos, etc.)</li>
                        <li>Botón de carrito e integración de ventana</li>
                    </ul>
                </section>

                {/* CATÁLOGO (duda)
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold text-center">Catálogode Productos</h2>
                    <ul>
                        <li>Ventana de compras***</li> 
                        <li>Cantidades, precios unitarios y total automático</li>
                        <li>Botón checkout***</li>
                    </ul>
                </section> */}

                {/* DASHBOARD */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold text-center">Dashboard</h2>
                    <ul>
                        <li>Tendrás la visualización general del stock</li>
                        <li>Cantidad de productos</li>
                        <li>Stockify te avisará por medio de alertas cuando el inventario sea bajo</li>
                        <li>No olvides, las estadísticas básicas que son parte integral para tu negocio</li>
                    </ul>
                </section>

                {/* FUNCIONES FUTURAS */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold text-center">Funcionalidades Futuras</h2>
                    <ul>
                        <li> El administrador podrá recibir un correo cuando se cree una orden de compra </li>

                        <li>El administrador podrá ver el total del inventario </li>
                        <li>El administrador verá un reporte con todos los pedidos finalizados</li>


                        <li>Los vendedores podrán reservar productos</li>
                    </ul>
                </section>

                {/* BENEFICIOS */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold text-center">Beneficios del Producto</h2>
                    <ul>
                        <li>Ahorro de tiempo y control automatizado</li>
                        <li>Información centralizada y precisa</li>
                        <li>Mejora la gestión del inventario y compras</li>
                        <li>Pagos, ventas y usuarios centralizados</li>
                    </ul>
                </section>

                {/* PÚBLICO OBJETIVO */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold text-center">Público Objetivo</h2>
                    <ul>
                        <li>Ferreterías y tiendas minoristas</li>
                        <li>Distribuidores de materiales y PyMEs</li>
                        <li>Y en general, cualquier negocio interesado en el control eficiente del inventario</li>
                    </ul>
                </section>

                {/* EQUIPO */}
                <section className="section-box p-4 mb-4 border border-warning rounded">
                    <h2 className="text-warning fw-semibold text-center">Creadores del Proyecto</h2>

                    <div className="d-flex justify-content-center gap-4">
                        <div className="text-center">
                            <img src="./../public/screenshotjose1.png" alt="Foto 1" className="rounded mb-2" style={{ width: "150px", height: "180px", objectFit: "cover" }} />
                            <p className="text-warning">José Miguel Nieves (VEN)</p>
                        </div>
                        <div className="text-center">
                            <img src="./../public/screenshotantonio1.png" alt="Foto 1" className="rounded mb-2" style={{ width: "150px", height: "180px", objectFit: "cover" }} />
                            <p className="text-warning">Antonio Villarreal (VEN)</p>
                        </div>
                        <div className="text-center">
                            <img src="./../public/screenshootgavo1.png" alt="Foto 1" className="rounded mb-2" style={{ width: "150px", height: "180px", objectFit: "cover" }} />
                            <p className="text-warning">Gavo Sanagustín (World citizen)</p>
                        </div>
                    </div>
                </section>


                <section className="section-box p-4 mb-4 border border-warning rounded text-center">
                    <h2 className="text-warning fw-semibold text-center">Así que ya lo sabes...</h2>
                    <p>
                        <strong>
                            Stockify es más que una aplicación de inventario, es la herramienta que estabas buscando para mejorar tus ventas,
                            tomar decisiones inteligentes, reducir pérdidas y automatizar la operación, ¿Lo ves? ¡SOMOS TU MEJOR OPCIÓN!
                        </strong>
                    </p>
                    <p>¿Qué esperas? Cotizamos tu solución ideal.</p>
                </section>
            </div>
        </div>
    );
};

export default Home;
