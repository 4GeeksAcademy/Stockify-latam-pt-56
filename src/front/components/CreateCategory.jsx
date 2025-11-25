import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const CreateCategory = () => {
    const { dispatch, store } = useGlobalReducer()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const categories = store.categories || []

    const [formData, setFormData] = useState({
        category_code: '',
        category_name: '',
        category_state: true,
        creation_date: Math.floor(Date.now() / 1000) // Timestamp actual
    });

    // Cargar categorías existentes
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
            const result = await response.json();

            if (response.ok) {
                dispatch({ type: 'set_categories', payload: result.categories })
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

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
        setMessage({ type: '', text: '' });

        // Validaciones
        if (!formData.category_code || !formData.category_name) {
            setMessage({ type: 'error', text: 'Código y nombre de categoría son obligatorios' });
            setLoading(false);
            return;
        }

        if (isNaN(formData.category_code)) {
            setMessage({ type: 'error', text: 'El código de categoría debe ser un número' });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    category_code: parseInt(formData.category_code),
                    creation_date: Math.floor(Date.now() / 1000)
                })
            });

            const result = await response.json();

            if (response.status === 201) {
                setMessage({ type: 'success', text: 'Categoría creada exitosamente' });
                setFormData({
                    category_code: '',
                    category_name: '',
                    category_state: true,
                    creation_date: Math.floor(Date.now() / 1000)
                });
                fetchCategories(); // Recargar la lista
            } else {
                setMessage({ type: 'error', text: result.msg || 'Error al crear categoría' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión con el servidor' });
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
            {store.userData.role == "Administrator" && "Soy administrador"}
            <div className="main-layout">
                {/* Create Category Panel */}
                <div className="panel">
                    <div className="panel-header">
                        <h2><i className="fas fa-plus-circle"></i> Crear Nueva Categoría</h2>
                    </div>
                    <div className="panel-body">
                        {message.text && (
                            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                                {message.text}
                            </div>
                        )}

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
                                >
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Volver
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Categories List Panel */}
                <div className="panel">
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

