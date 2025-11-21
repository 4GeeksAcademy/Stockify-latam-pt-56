import React, { useState } from 'react';
// import '../stylesheets/LoginForm.css';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {

    const navigate = useNavigate()

    const { dispatch } = useGlobalReducer()

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        isMaster: false
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es obligatorio';
        }
        else if (!validateEmail(formData.email)) {
            newErrors.email = 'Por favor ingrese un correo electrónico valido';

        }
        if (!formData.username) {
            newErrors.username = 'El nombre del usuario es obligatorio';
        }
        if (!formData.password) {
            newErrors.username = 'La contraseña es obligatoria'
        }
        else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {

            try {
                const PATH = formData.isMaster ? 'token/master' : 'token'
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
                    // Guardar el token JWT en localStorage
                    dispatch({ type: 'set_user_data', payload: data.user })
                    dispatch({ type: 'set_token', payload: data.token })
                    alert(`Bienvenido ${data.user.username}!`);

                    if (data.user.rol == 'master') {
                        navigate('/createuser')
                        return
                    }

                    navigate('/admin')

                } else {
                    setErrors({ submit: data.msg || 'Credenciales no válidas o error del servidor.' });
                }

            } catch (error) {
                setErrors({ submit: 'Error de conexión con el servidor' });
            }
        }
    };
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ width: "380px", borderRadius: "1rem" }}>
                <div className='login-container' >
                    <div className='login-form-wrapper' >
                        <p className="text-start fs-2 fw-bold mb-4">Stockify user sign in</p>
                        <form className='login-form' onSubmit={handleSubmit} >
                            <div className='' >
                                <label htmlFor="email" className="form-label fw-semibold">Email address</label >
                                <input
                                    type="email"
                                    id='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder='Ingrese tu correo electrónico'
                                    className={errors.email ? 'error' : 'form-control'}
                                    required
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>

                            <div className='d-flex gap-2 justify-content-start align-items-center py-2'>
                                <input type='checkbox' id='remember' />
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
                                    className={errors.username ? 'error' : 'form-control'}
                                    required
                                />
                                {errors.username && <span className="error-message">{errors.username}</span>}
                            </div>

                            <div className='mb-3 text-start' >
                                <label htmlFor='password' className="form-label fw-semibold">Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder='Ingrese tu contraseña'
                                    className={errors.password ? 'error' : 'form-control'}
                                    required
                                />
                                {errors.password && <span className="error-message">{errors.password}</span>}
                                <div className='d-flex gap-4 justify-content-start align-items-center pt-2 flex-column'>

                                    <div className='d-flex gap-2 justify-content-start align-items-center pt-2'>
                                        <input
                                            type='checkbox'
                                            id='showPassword'
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                        />
                                        <label htmlFor='showPassword' className="form-label fw-lighter m-0">Show Password</label>
                                    </div>
                                    <div className='d-flex gap-2 justify-content-start align-items-center pt-2'>
                                        <input
                                            type='checkbox'
                                            id='showMaster'
                                            checked={formData.isMaster}
                                            onChange={() => setFormData({ ...formData, isMaster: !formData.isMaster })}
                                        />
                                        <label htmlFor='showMaster' className="form-label fw-lighter m-0">Is master</label>
                                    </div>
                                </div>
                            </div>

                            <button type='submit' className="btn btn-warning w-100 fw-bold mb-3">
                                Sign in
                            </button>

                            <div className='col'>
                                <button className="btn btn-outline-secondary w-100 fw-lighter fs-6" onClick={() => { navigate("/signup") }}>Create credentials for Master</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default LoginForm;

