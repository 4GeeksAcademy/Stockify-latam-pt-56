import React, { useState } from 'react';
import '../stylesheets/LoginForm.css';


const LoginForm = () => {
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
            setIsLoading(true);

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
                    localStorage.setItem('jwtToken', data.token);
                    localStorage.setItem('userData', JSON.stringify(data.user));

                    alert(`Bienvenido ${data.user.username}!`);

                } else {
                    // Mostrar error del backend
                    setErrors({ submit: data.message });
                }

            } catch (error) {
                setErrors({ submit: 'Error de conexión con el servidor' });
            } finally {
                setIsLoading(false);
            }
        }
    };
    return (
        <div className='login-container' >
            <div className='login-form-wrapper' >
                <h1 className='login-title'>IAM user sign in</h1>
                <form className='login-form' onSubmit={handleSubmit} >
                    <div className='form-group' >
                        <label htmlFor="email">Account ID or alias</label >
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
                        <label htmlFor='username'>IAM username</label>
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

                    <div className='help-link' >
                        <a href='#'>Having trouble</a>
                    </div>

                    <button type='submit' className='signin-button'>
                        Sign in
                    </button>

                    <div className="alternative-signin">
                        <button className="root-user-button">Sign in using root user email</button>
                    </div>

                    <div className="create-account">
                        <a href="#">Create a new AWS account</a>
                    </div>
                </form>
                <div className="terms">
                    <p>
                        By continuing, you agree to AWS Customer Agreement or other agreement for AWS services, and the Privacy Notice.
                        This site uses essential cookies. See our Cookie Notice for more information.
                    </p>
                </div>
            </div>

        </div>
    )
}
export default LoginForm;

