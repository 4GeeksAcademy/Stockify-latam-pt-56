import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    // Validación básica de campos
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

        // ✅ ÉXITO - CUENTA CREADA
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

        // ✅ ERROR ESPECÍFICO DEL SERVIDOR
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

      // ✅ ERROR DE CONEXIÓN
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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "380px", borderRadius: "1rem" }}>
        <h3 className="text-center fw-bold mb-4">Sign up for Stockify</h3>

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
            <small className="form-text text-muted">
              Used for account creation
            </small>
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
            <small className="form-text text-muted">
              Used for account creation
            </small>
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
            <small className="form-text text-muted">
              Used for account creation
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 fw-bold mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creando Cuenta...
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
            className="btn btn-outline-secondary w-100 fw-semibold"
            onClick={() => { navigate("/") }}
            disabled={loading}
          >
            Sign in to an existing Stockify account
          </button>
        </form>
      </div>
    </div>
  );
};