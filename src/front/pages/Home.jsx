import React from "react";
import { Link } from "react-router-dom";
import "./presentation.css";

const Home = () => {
    return (
        <>
            {/* NAVBAR */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        Stockify
                    </Link>
                    <button
                        className="navbar-toggler"
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
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Inicio
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="btn btn-warning mx-2" to="/loginform">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* CONTENIDO PRINCIPAL */}
            <div className="home-container">

                {/* HERO */}
                <section className="hero">
                    <div className="hero-text">
                        <h1 className="product-title-home">Stockify</h1>
                        <p className="product-slogan">
                            La solución inteligente para la gestión de inventarios, ventas y usuarios.
                        </p>
                    </div>
                </section>

                {/* PROBLEMA */}
                <section className="section-box">
                    <h2 className="section-title">¿Por qué es útil nuestro producto?</h2>
                    <p>
                        Los negocios minoristas pierden tiempo, dinero y clientes por una mala gestión del inventario.
                    </p>
                    <p className="highlight-text">
                        Sin una herramienta adecuada, los negocios enfrentan desorganización, poca productividad y baja capacidad de crecimiento.
                    </p>
                </section>

                {/* SOLUCIÓN */}
                <section className="section-box">
                    <h2 className="section-title">¿Cómo lo resolvemos?</h2>
                    <ul className="styled-list">
                        <li>Organización eficiente del inventario.</li>
                        <li>Datos actualizados en tiempo real.</li>
                        <li>Gestión centralizada de productos, compras y usuarios.</li>
                        <li>Automatización de tareas repetitivas.</li>
                        <li>Soporte para decisiones inteligentes.</li>
                    </ul>
                </section>

                {/* FUNCIONALIDADES ACTUALES */}
                <section className="section-box">
                    <h2 className="section-title">Funcionalidades Actuales</h2>
                    <div className="features-grid">
                        <div className="feature-item">Gestión de Usuarios</div>
                        <div className="feature-item">Gestión de Productos</div>
                        <div className="feature-item">Carrito y Compras</div>
                        <div className="feature-item">Dashboard Estadístico</div>
                    </div>
                </section>

                {/* DETALLE DE FUNCIONES */}
                <section className="section-box">
                    <h2 className="section-title">Gestión de Productos</h2>
                    <ul>
                        <li>Crear productos con formulario limpio y validaciones</li>
                        <li>Cargar imágenes y detalles específicos</li>
                        <li>Clasificar por categorías (materiales, químicos, etc.)</li>
                        <li>Botón de carrito e integración de modal especializado</li>
                    </ul>
                </section>

                {/* CATÁLOGO Y CARRITO */}
                <section className="section-box">
                    <h2 className="section-title">Catálogo y Carrito de Compras</h2>
                    <ul>
                        <li>Modal ShoppingCart</li>
                        <li>Cantidades, precios unitarios y total automático</li>
                        <li>Botón checkout</li>
                    </ul>
                </section>

                {/* DASHBOARD / ESTADÍSTICAS */}
                <section className="section-box">
                    <h2 className="section-title">Dashboard</h2>
                    <ul>
                        <li>Visualización general del stock</li>
                        <li>Cantidad de productos</li>
                        <li>Alertas de bajo inventario</li>
                        <li>Estadísticas básicas</li>
                    </ul>
                </section>

                {/* FUNCIONALIDADES FUTURAS (espacios editables) */}
                <section className="future-section section-box">
                    <h2 className="section-title">Funcionalidades Futuras (Backlog)</h2>
                    <ul className="future-list">
                        <li>__________________________________</li>
                        <li>__________________________________</li>
                        <li>__________________________________</li>
                        <li>__________________________________</li>
                        <li>__________________________________</li>
                        <li>__________________________________</li>
                        <li>__________________________________</li>
                    </ul>
                </section>

                {/* BENEFICIOS */}
                <section className="section-box">
                    <h2 className="section-title">Beneficios del Producto</h2>
                    <ul>
                        <li>Ahorro de tiempo y control automatizado</li>
                        <li>Información centralizada y precisa</li>
                        <li>Mejora la gestión del inventario y compras</li>
                        <li>Pagos, ventas y usuarios centralizados</li>
                    </ul>
                </section>

                {/* TECNOLOGÍAS
                <section className="section-box">
                    <h2 className="section-title">Técnicas usadas</h2>
                    <div className="tech-grid">
                        <div className="tech-item">React.js</div>
                        <div className="tech-item">Flask & SQLAlchemy</div>
                        <div className="tech-item">Bootstrap / Font Awesome</div>
                        <div className="tech-item">JWT</div>
                    </div>
                </section> */}

                {/* PÚBLICO OBJETIVO */}
                <section className="section-box">
                    <h2 className="section-title">Público Objetivo</h2>
                    <ul>
                        <li>Ferreterías y tiendas minoristas</li>
                        <li>Distribuidores de materiales y PyMEs</li>
                        <li>Negocios interesados en control eficiente de inventario</li>
                    </ul>
                </section>

                {/* EQUIPO - PLACEHOLDERS PARA 3 FOTOS */}
                <section className="team-section section-box">
                    <h2 className="section-title">Creadores del Proyecto</h2>

                    <p className="team-note">Sube las fotos a <code>/src/front/assets/</code> y cambia los nombres si las reemplazas.</p>

                    <div className="team-grid">
                        {/* Placeholder 1 */}
                        <div className="team-member">
                            <div className="team-photo">
                                {/* Si más adelante pones una imagen real, reemplaza este div por:
                                    <img src="/src/front/assets/integrante1.jpg" alt="Integrante 1" />
                                */}
                                Foto 1
                            </div>
                            <p className="team-name">Nombre integrante 1</p>
                        </div>

                        {/* Placeholder 2 */}
                        <div className="team-member">
                            <div className="team-photo">
                                Foto 2
                            </div>
                            <p className="team-name">Nombre integrante 2</p>
                        </div>

                        {/* Placeholder 3 */}
                        <div className="team-member">
                            <div className="team-photo">
                                Foto 3
                            </div>
                            <p className="team-name">Nombre integrante 3</p>
                        </div>
                    </div>
                </section>

                {/* LEMA / CIERRE */}
                <section className="closing-section section-box">
                    <p className="closing-text">
                        <strong>
                            Stockify es más que una aplicación de inventario, es la herramienta que estabas buscando para mejorar tus ventas,
                            tomar decisiones inteligentes, reducir pérdidas y automatizar la operación en pequeñas y medianas empresas.
                        </strong>
                    </p>
                    <p className="closing-cta">
                        ¿Qué esperas? Llámanos para cotizaciones de tu producto — nos adaptamos a tu presupuesto.
                    </p>
                </section>

            </div> {/* cierre de home-container */}
        </>
    );
};

export default Home;
