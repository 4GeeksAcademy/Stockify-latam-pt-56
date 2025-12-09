import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

export const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación de campos
    if (!email || !password || !username) {
      await Swal.fire({
        title: 'Campos Incompletos',
        text: 'Por favor completa todos los campos requeridos',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#f59e0b'
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/master`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            username: username,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Master created:", data);

        //  CUENTA CREADA
        await Swal.fire({
          title: '¡Cuenta Creada Exitosamente!',
          html: `
            <div style="text-align: center;">
              <div style="font-size: 3rem; color: #10b981; margin: 10px 0;">
                🎉
              </div>
              <p>Tu cuenta de <strong>Stockify</strong> ha sido creada</p>
              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <strong>${username}</strong><br/>
                <small style="color: #6b7280;">${email}</small>
              </div>
              <small style="color: #6b7280;">
                Ahora puedes iniciar sesión con tus credenciales
              </small>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Ir al Login',
          confirmButtonColor: '#10b981',
          showCancelButton: false,
          allowOutsideClick: false
        }).then(() => {
          navigate('/');
        });

      } else {
        const errorData = await response.json();
        console.error("Error en el registro:", errorData);

        //  ERROR ESPECÍFICO DEL SERVIDOR
        await Swal.fire({
          title: 'Error al Crear Cuenta',
          html: `
            <div style="text-align: center;">
              <div style="font-size: 3rem; margin: 10px 0;">😕</div>
              <p>${errorData.msg || 'No se pudo crear la cuenta maestra'}</p>
              <small style="color: #6b7280;">
                ${errorData.msg && errorData.msg.includes('email') ? 'El email ya está en uso' : ''}
                ${errorData.msg && errorData.msg.includes('username') ? 'El nombre de usuario ya existe' : ''}
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

      // ERROR DE CONEXIÓN
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

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg shadow-md"
        style={{ backgroundColor: "white", borderBottom: "2px solid #b8860b" }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/" style={{ fontSize: "1.2rem" }}>
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
                <Link className="navbar-brand fw-bold" to="/" style={{ fontSize: "1rem" }}>
                  About us
                </Link>
                <Link className="btn btn-outline-success btn-sm" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow-lg p-4" style={{ width: "380px", borderRadius: "1rem" }}>
          <div>
            <div className="d-flex justify-content-start align-items-center gap-2 pb-1">
              <i className="fs-4 fa-solid fa-hands-holding-child m-0"></i>
              <h3 className="fw-bold m-0">Master create</h3>
            </div>
            <p className="fw-lighter m-0 pb-3" style={{ fontSize: "0.8rem" }}>Create credentials for your master account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3 text-start">
              <label htmlFor="email" className="form-label fw-semibold">
                Master email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <p className="fw-lighter pt-2" style={{ fontSize: "0.8rem" }}>
                Used for account creation
              </p>
            </div>

            {/* Password */}
            <div className="mb-3 text-start">
              <label htmlFor="password" className="form-label fw-semibold">
                Master password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <p className="fw-lighter pt-2" style={{ fontSize: "0.8rem" }}>
                Used for account creation
              </p>
            </div>

            {/* Username */}
            <div className="mb-3 text-start">
              <label htmlFor="username" className="form-label fw-semibold">
                Master username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
              <p className="fw-lighter pt-2" style={{ fontSize: "0.8rem" }}>
                Used for account creation
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100 fw-bold mb-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Creating Account...
                </>
              ) : (
                'Create a new account'
              )}
            </button>

            <div className="d-flex align-items-center mb-3">
              <hr className="flex-grow-1" />
              <span className="mx-2 text-muted fw-semibold">OR</span>
              <hr className="flex-grow-1" />
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary w-100 fw-lighter fs-6"
              onClick={() => { navigate("/login") }}
              disabled={loading}
            >
              Login to an existing Stockify account
            </button>
          </form>
        </div>
      </div>
    </div>
  )
};