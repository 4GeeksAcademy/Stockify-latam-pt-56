import React, { useState } from 'react';
import '../stylesheets/LoginForm.css';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {

    const navigate = useNavigate()

    const { dispatch } = useGlobalReducer()

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
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
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}api/token`, {
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

                if (data.success) {
                    // Guardar el token JWT en localStorage
                    dispatch({ action: 'set_user_data', payload: data.user })
                    dispatch({ action: 'set_token', payload: data.token })


                    alert(`Bienvenido ${data.user.username}!`);

                } else {
                    // Mostrar error del backend
                    setErrors({ submit: data.message });
                }

                navigate('/createuser')

            } catch (error) {
                setErrors({ submit: 'Error de conexión con el servidor' });
            }
        }
    };
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">

            <div className='login-container' >
                <div className='login-form-wrapper' >
                    <p className="text-start fs-2 fw-bold mb-4">Stockify user sign in</p>
                    <form className='login-form' onSubmit={handleSubmit} >
                        <div className='form-group' >
                            <label htmlFor="email">Email address</label >
                            <input
                                type="email"
                                id='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                placeholder='Ingrese tu correo electrónico'
                                className={errors.email ? 'error' : ''}
                                required
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className='remember-account' >
                            <input type='checkbox' id='remember' />
                            <label htmlFor="remember">Remember this account</label>
                        </div>

                        <div className='form-group'>
                            <label htmlFor='username'>Account username</label>
                            <input
                                type="text"
                                id='username'
                                name='username'
                                value={formData.username}
                                onChange={handleChange}
                                placeholder='Ingrese tu nombre de usuario'
                                className={errors.username ? 'error' : ''}
                                required
                            />
                            {errors.username && <span className="error-message">{errors.username}</span>}
                        </div>

                        <div className='form-group' >
                            <label htmlFor='password'>Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                placeholder='Ingrese tu contraseña'
                                className={errors.password ? 'error' : ''}
                                required
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                            <div className='show-password'>
                                <input
                                    type='checkbox'
                                    id='showPassword'
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                <label htmlFor='showPassword'>Show Password</label>
                            </div>
                        </div>

                        <button type='submit' className="btn btn-warning w-100 fw-bold mb-3">
                            Sign in
                        </button>

                        <div>
                            <button className="btn btn-outline-secondary w-100 fw-semibold" onClick={() => { navigate("/signup") }}>Create credentials for your Master account</button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}
export default LoginForm;

