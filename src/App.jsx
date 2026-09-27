import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";

function DashboardPlaceholder() {
  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      <p>Welcome to FlashDeck.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <main>
          <Routes>
            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route element={<ProtectedRoute />}>
              <Route
                path="/"
                element={<DashboardPlaceholder />}
              />
            </Route>
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;