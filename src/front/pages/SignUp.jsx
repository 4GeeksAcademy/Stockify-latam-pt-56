import React, { useState } from "react";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert("Master created successfully");
      } else {
        const errorData = await response.json();
        console.error("Error en el registro:", errorData);
        alert("Error at creating master");
      }
    } catch (error) {
      console.error("Error connection:", error);
      alert("Cannot connect with server");
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
            />
            <small className="form-text text-muted">
              Used for account creation
            </small>
          </div>

          <button type="submit" className="btn btn-warning w-100 fw-bold mb-3">
            Create a new account
          </button>

          <div className="d-flex align-items-center mb-3">
            <hr className="flex-grow-1" />
            <span className="mx-2 text-muted fw-semibold">OR</span>
            <hr className="flex-grow-1" />
          </div>

          <button type="button" className="btn btn-outline-secondary w-100 fw-semibold">
            Sign in to an existing Stockify account
          </button>
        </form>
      </div>
    </div>
  );
};
