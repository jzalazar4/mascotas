import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Lock, Mail, User } from "lucide-react";
import "../style/AuthForm.css"; 
import PasswordStrength from "../components/PasswordStrength";
import { useAuthStore } from "../store/authStore";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const toggleForm = () => setIsSignUp(!isSignUp);

  // Estados del formulario
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form Login
  const [passwordLogin, setPasswordLogin] = useState("");
  const [emailLogin, setEmailLogin] = useState("");

  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  // Manejar registro
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validación de contraseñas
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      await signup(email, password, name, lastName);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  // Manejar inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Implementar lógica de login con la API
      console.log("Iniciar sesión con:", emailLogin, passwordLogin);
      // await login(email, password);
      // navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`auth-container ${isSignUp ? "sign-up-mode" : "login-mode"}`}>
      {/* Panel izquierdo */}
      <div className="panel left-panel">
        <div className="content">
          <h1>{isSignUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}</h1>
          <p>
            {isSignUp
              ? "Inicia sesión acá para ingresar."
              : "Regístrate acá para obtener acceso."}
          </p>
          <button className="btn transparent" onClick={toggleForm}>
            {isSignUp ? "Iniciar sesión" : "Regístrate"}
          </button>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="panel right-panel">
        <div className="content">
          <h1>{isSignUp ? "Crear Cuenta" : "Ingresar"}</h1>
          {isSignUp ? (
            <form onSubmit={handleSignUp}>
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className='text-red-250 font-semibold mt-2'>{error}</p>}
              <PasswordStrength password={password} />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errorMessage && <p className="error">{errorMessage}</p>}
              <button className="btn">Registrarse</button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              
              <input
                type="email"
                placeholder="Email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
                required
              />
              <button className="btn">Iniciar sesión</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
