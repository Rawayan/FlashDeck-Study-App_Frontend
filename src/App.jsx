import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DeckList from "./pages/DeckList";
import DeckDetail from "./pages/DeckDetail";
import DeckForm from "./pages/DeckForm";
import CardForm from "./pages/CardForm";
import Study from "./pages/Study";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/decks" element={<DeckList />} />
          <Route path="/decks/new" element={<DeckForm />} />
          <Route path="/decks/:id" element={<DeckDetail />} />
          <Route path="/decks/:id/edit" element={<DeckForm />} />
          <Route path="/decks/:deckId/cards/new" element={<CardForm />} />
          <Route path="/cards/:id/edit" element={<CardForm />} />
          <Route path="/decks/:id/study" element={<Study />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;