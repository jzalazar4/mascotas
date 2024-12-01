import React, { useState } from "react";
import "../style/AuthForm.css"; 

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => setIsSignUp(!isSignUp);

  return (
    <div className={`auth-container ${isSignUp ? "sign-up-mode" : ""}`}>
      {/* Panel Izquierdo */}
      <div className="panel left-panel">
        <div className="content">
          <h1>¿Ya tenés una cuenta?</h1>
          <p>Ingresa acá para iniciar sesión.</p>
          <button className="btn transparent" onClick={toggleForm}>
            Iniciar
          </button>
        </div>
      </div>

      {/* Panel Derecho */}
      <div className="panel right-panel">
        <div className="content">
          <h1>{isSignUp ? "Crear Cuenta" : "Ingresar"}</h1>
          {isSignUp ? (
            <form>
              <input type="text" placeholder="Nombre" />
              <input type="text" placeholder="Apellido" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Contraseña" />
              <input type="password" placeholder="Verificar contraseña" />
              <button className="btn">Registrarse</button>
            </form>
          ) : (
            <form>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Contraseña" />
              <button className="btn">Sign In</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


export default AuthForm;
