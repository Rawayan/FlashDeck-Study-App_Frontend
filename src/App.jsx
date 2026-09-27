import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import DeckList from "./pages/DeckList";
import DeckDetail from "./pages/DeckDetail";
import DeckForm from "./pages/DeckForm";
import CardForm from "./pages/CardForm";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

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

            <Route
              path="/decks"
              element={<DeckList />}
            />

            <Route
              path="/decks/:id"
              element={<DeckDetail />}
            />

            <Route
              path="/decks/new"
              element={<DeckForm />}
            />

            <Route
              path="/decks/:id/edit"
              element={<DeckForm />}
            />

            <Route
              path="/decks/:deckId/cards/new"
              element={<CardForm />}
            />

            <Route
              path="/cards/:id/edit"
              element={<CardForm />}
            />

            <Route element={<ProtectedRoute />}>
              <Route
                path="/"
                element={<Dashboard />}
              />
            </Route>
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;