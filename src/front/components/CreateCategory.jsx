import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';
import Swal from 'sweetalert2';

export const CreateCategory = ({ onCategoryCreated }) => {
    const { dispatch, store } = useGlobalReducer()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const categories = store.categories || []

    const [formData, setFormData] = useState({
        category_code: '',
        category_name: '',
        category_state: true,
        creation_date: Math.floor(Date.now() / 1000)
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validaciones
        if (!formData.category_code || !formData.category_name) {
            await Swal.fire({
                title: 'Campos Obligatorios',
                text: 'Código y nombre de categoría son obligatorios',
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#f59e0b'
            });
            setLoading(false);
            return;
        }

        if (isNaN(formData.category_code)) {
            await Swal.fire({
                title: 'Código Inválido',
                text: 'El código de categoría debe ser un número',
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#f59e0b'
            });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${store.token}` // ← Añadir token si es necesario
                },
                body: JSON.stringify({
                    ...formData,
                    category_code: parseInt(formData.category_code),
                    creation_date: Math.floor(Date.now() / 1000)
                })
            });

            const result = await response.json();

            if (response.status === 201) {
                await Swal.fire({
                    title: '¡Categoría Creada!',
                    html: `
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; color: #10b981; margin: 10px 0;">
                                ✅
                            </div>
                            <p>La categoría ha sido creada exitosamente</p>
                            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0;">
                                <strong>${formData.category_name}</strong><br/>
                                <small style="color: #6b7280;">
                                    Código: ${formData.category_code}
                                </small>
                            </div>
                            <small style="color: #6b7280;">
                                Estado: ${formData.category_state ? '🟢 Activa' : '🔴 Inactiva'}
                            </small>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                    confirmButtonColor: '#10b981',
                    timer: 4000,
                    timerProgressBar: true
                });

                if (onCategoryCreated) {
                    onCategoryCreated();
                }

                // Limpiar formulario
                setFormData({
                    category_code: '',
                    category_name: '',
                    category_state: true,
                    creation_date: Math.floor(Date.now() / 1000)
                });

            } else {
                await Swal.fire({
                    title: 'Error al Crear Categoría',
                    html: `
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin: 10px 0;">😕</div>
                            <p>${result.msg || 'No se pudo crear la categoría'}</p>
                            <small style="color: #6b7280;">
                                ${result.msg && result.msg.includes('código') ? 'El código de categoría ya existe' : ''}
                                ${result.msg && result.msg.includes('nombre') ? 'El nombre de categoría ya existe' : ''}
                            </small>
                        </div>
                    `,
                    icon: 'error',
                    confirmButtonText: 'Intentar Nuevamente',
                    confirmButtonColor: '#ef4444'
                });
            }
        } catch (error) {
            console.error("Error connection:", error);

            await Swal.fire({
                title: 'Error de Conexión',
                html: `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin: 10px 0;">📡</div>
                        <p>No se pudo conectar con el servidor</p>
                        <small style="color: #6b7280;">
                            Verifica tu conexión a internet e intenta nuevamente
                        </small>
                    </div>
                `,
                icon: 'error',
                confirmButtonText: 'Reintentar',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="container-fluid">
            {/* Search Section */}
            <div className="search-section">
                <div className="search-container">
                    <div className="form-group search-input">
                        <input type="text" className="form-control" placeholder="Buscar categorías..." />
                    </div>
                    <button className="btn btn-primary">
                        <i className="fas fa-search"></i> Buscar
                    </button>
                </div>
            </div>
            <div className="d-flex main-layout">
                {store.userData.role == "Administrator" &&

                    <div className="col-6 panel">
                        <div className="panel-header">
                            <h2><i className="fas fa-plus-circle"></i> Crear Nueva Categoría</h2>
                        </div>
                        <div className="panel-body">
                            <form id="categoryForm" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="category_code">
                                        Código de Categoría *
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="category_code"
                                        name="category_code"
                                        value={formData.category_code}
                                        onChange={handleChange}
                                        placeholder="Ej: 1001"
                                        required
                                        disabled={loading}
                                    />
                                    <div className="form-text">Código único numérico para la categoría</div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="category_name">
                                        Nombre de la Categoría *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="category_name"
                                        name="category_name"
                                        value={formData.category_name}
                                        onChange={handleChange}
                                        placeholder="Ej: Electrónicos, Ropa, Hogar..."
                                        required
                                        disabled={loading}
                                    />
                                    <div className="form-text">Nombre descriptivo de la categoría</div>
                                </div>

                                <div className="form-group">
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="category_state"
                                            name="category_state"
                                            checked={formData.category_state}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        <label className="form-check-label" htmlFor="category_state">
                                            Categoría activa
                                        </label>
                                    </div>
                                    <div className="form-text">Desactiva esta opción para ocultar la categoría</div>
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-2"></i>
                                                Crear Categoría
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-block"
                                        onClick={goBack}
                                        disabled={loading}
                                    >
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Volver
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                }
                {/* Create Category Panel */}

                {/* Categories List Panel */}
                <div className="col panel">
                    <div className="panel-header">
                        <h2><i className="fas fa-list"></i> Lista de Categorías</h2>
                    </div>
                    <div className="panel-body">
                        {categories.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <i className="fas fa-tags"></i>
                                </div>
                                <h3>No hay categorías</h3>
                                <p>Crea tu primera categoría usando el formulario</p>
                            </div>
                        ) : (
                            <div className="categories-grid">
                                {categories.map(category => (
                                    <div key={category.id} className="category-card">
                                        <div className="category-header">
                                            <div>
                                                <div className="category-title">{category.category_name}</div>
                                                <span className={`badge ${category.category_state ? 'bg-success' : 'bg-secondary'}`}>
                                                    {category.category_state ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </div>
                                            <div className="category-code">Código: {category.category_code}</div>
                                        </div>
                                        <div className="category-meta">
                                            <div className="category-date">
                                                <i className="far fa-calendar me-1"></i>
                                                Creada: {new Date(category.creation_date * 1000).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};