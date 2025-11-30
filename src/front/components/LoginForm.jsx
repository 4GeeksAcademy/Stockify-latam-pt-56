import React, { useState } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const LoginForm = () => {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        isMaster: false
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Por favor ingrese un correo electrónico válido';
        }
        if (!formData.username) {
            newErrors.username = 'El nombre del usuario es obligatorio';
        }
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const PATH = formData.isMaster ? 'token/master' : 'token';
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/${PATH}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (data.token && data.user) {
                await Swal.fire({
                    title: `¡Bienvenido a Stockify!`,
                    html: `
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; color: #10b981; margin: 10px 0;">
                                👋
                            </div>
                            <p>Hola <strong>${data.user.username}</strong></p>
                            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0;">
                                <strong>${data.user.email}</strong><br/>
                                <small style="color: #6b7280;">
                                    Rol: ${data.user.rol === 'master' ? 'Administrador Master' : 'Usuario'}
                                </small>
                            </div>
                            <small style="color: #6b7280;">
                                Redirigiendo a tu dashboard...
                            </small>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                    confirmButtonColor: '#10b981',
                    timer: 6000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false
                });

                // Guardar el token JWT en localStorage
                dispatch({ type: 'set_user_data', payload: data.user });
                dispatch({ type: 'set_token', payload: data.token });

                if (data.user.rol === 'master') {
                    navigate('/masterview');
                    return;
                }

                navigate('/dashboard');

            } else {
                await Swal.fire({
                    title: 'Error de Autenticación',
                    html: `
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin: 10px 0;">🔐</div>
                            <p>${data.msg || 'Credenciales no válidas'}</p>
                            <small style="color: #6b7280;">
                                Verifica tu email, usuario y contraseña
                            </small>
                        </div>
                    `,
                    icon: 'error',
                    confirmButtonText: 'Intentar Nuevamente',
                    confirmButtonColor: '#ef4444'
                });
                setErrors({ submit: data.msg || 'Credenciales no válidas o error del servidor.' });
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
            setErrors({ submit: 'Error de conexión con el servidor' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ width: "380px", borderRadius: "1rem" }}>
                <div className='login-container'>
                    <div className='login-form-wrapper'>
                        <p className="text-start fs-2 fw-bold mb-4">Stockify user sign in</p>
                        <form className='login-form' onSubmit={handleSubmit}>
                            <div className=''>
                                <label htmlFor="email" className="form-label fw-semibold">Email address</label>
                                <input
                                    type="email"
                                    id='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder='Ingrese tu correo electrónico'
                                    className={errors.email ? 'form-control is-invalid' : 'form-control'}
                                    required
                                    disabled={loading}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            <div className='d-flex gap-2 justify-content-start align-items-center py-2'>
                                <input
                                    type='checkbox'
                                    id='remember'
                                    disabled={loading}
                                />
                                <label htmlFor="remember" className="form-label fw-lighter m-0">Remember this account</label>
                            </div>

                            <div className='mb-3 text-start pt-2'>
                                <label htmlFor='username' className="form-label fw-semibold">Account username</label>
                                <input
                                    type="text"
                                    id='username'
                                    name='username'
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder='Ingrese tu nombre de usuario'
                                    className={errors.username ? 'form-control is-invalid' : 'form-control'}
                                    required
                                    disabled={loading}
                                />
                                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                            </div>

                            <div className='mb-3 text-start'>
                                <label htmlFor='password' className="form-label fw-semibold">Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder='Ingrese tu contraseña'
                                    className={errors.password ? 'form-control is-invalid' : 'form-control'}
                                    required
                                    disabled={loading}
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                <div className='d-flex gap-4 justify-content-start align-items-center pt-2 flex-column'>

                                    <div className='d-flex gap-2 justify-content-start align-items-center pt-2'>
                                        <input
                                            type='checkbox'
                                            id='showPassword'
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                            disabled={loading}
                                        />
                                        <label htmlFor='showPassword' className="form-label fw-lighter m-0">Show Password</label>
                                    </div>
                                    <div className='d-flex gap-2 justify-content-start align-items-center pt-2'>
                                        <input
                                            type='checkbox'
                                            id='showMaster'
                                            checked={formData.isMaster}
                                            onChange={() => setFormData({ ...formData, isMaster: !formData.isMaster })}
                                            disabled={loading}
                                        />
                                        <label htmlFor='showMaster' className="form-label fw-lighter m-0">Is master</label>
                                    </div>
                                </div>
                            </div>

                            <button
                                type='submit'
                                className="btn btn-warning w-100 fw-bold mb-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Iniciando Sesión...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>

                            <div className='col'>
                                <button
                                    className="btn btn-outline-secondary w-100 fw-lighter fs-6"
                                    onClick={() => { navigate("/signup") }}
                                    disabled={loading}
                                    type="button"
                                >
                                    Create credentials for Master
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;