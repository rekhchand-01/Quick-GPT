import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import { routesConfig } from "./routes/RoutesConfig";
import { path } from "./routes/paths";
import { useAuth } from "./clerk";
import { useEffect } from "react";
import { setAuthTokenGetter } from "./api/axiosInstance";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const auth = useAuth();
  const getToken = auth?.getToken;

  useEffect(() => {
    if (typeof getToken === 'function') {
      setAuthTokenGetter(getToken);
    }
  }, [getToken]);

  return (
    <Routes>
      {/* Public Route */}
      <Route path={path.HOME} element={<Home />} />

      {/* Protected Routes */}
      <Route element={<Layout />}>
        {routesConfig.map((route, index) => (
          <Route
            key={index}
            index={route.path === ""}
            path={route.path}
            element={<ProtectedRoute>{route.element}</ProtectedRoute>}
          />
        ))}
      </Route>
    </Routes>
  );
}

export default App;
