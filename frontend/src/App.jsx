import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from "react-router-dom";
// importar views
import SignUp from "../views/SignUp";

// Proteger rutas de usuarios no autenticados
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" />; // va login
  } 
  if (!user.isVerified) {
    return <Navigate to="/signup" />; // va a verificar email
  }

  return children;    
};
// Redireccionar usuarios autenticados a home page
const RedirectAuthUser = ({ children }) => {

  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified)  {
    return <Navigate to="/" />; // va a home page
  }
  return children;
};
function App() {
 // const { isCheckingAuth, checkAuth } = useAuthStore();
/*
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
*/
  //if (isCheckingAuth) return <LoadingSpinner />;
  return (
    <div>

      <Routes>
        <Route
          path="/"
          element= {
            <ProtectedRoute>
              {/**aca va al dashboard */}
            </ProtectedRoute>
          } />
        <Route
              path="/signup"
              element= {
                <RedirectAuthUser>
                  <SignUp />
                </RedirectAuthUser>
              } />

        {/* otras rutas*/}
        <Route 
          path="*"
          element= {<Navigate to="/" replace />}
        />
      </Routes>
      <Toaster />
      </div>
      
  );
}

export default App;
