import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDecks, getStats } from "../api/decks";
import StatCard from "../components/StatCard";
import BoxBadge from "../components/BoxBadge";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [decks, setDecks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsResponse, decksResponse] =
          await Promise.all([
            getStats(),
            getDecks(),
          ]);

        setStats(statsResponse.data);
        setDecks(decksResponse.data.results || []);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Track your study progress and review
            your cards.
          </p>
        </div>

        <Link
          to="/decks/new"
          className="primary-button"
        >
          + New Deck
        </Link>
      </div>

      {/* Statistics */}
      <section className="stats-grid">
        <StatCard
          title="Due Now"
          value={stats?.due_now ?? 0}
        />

        <StatCard
          title="Total Cards"
          value={stats?.cards ?? 0}
        />

        <StatCard
          title="Mastered"
          value={stats?.mastered ?? 0}
        />

        <StatCard
          title="Accuracy"
          value={`${stats?.accuracy ?? 0}%`}
        />
      </section>

      {/* Box Distribution */}
      <section className="dashboard-section">
        <h2>Box Distribution</h2>

        <div className="box-grid">
          {[1, 2, 3, 4, 5].map((box) => (
            <div
              key={box}
              className="box-stat"
            >
              <BoxBadge box={box} />

              <strong>
                {stats?.boxes?.[box] ?? 0}
              </strong>

              <span>cards</span>
            </div>
          ))}
        </div>
      </section>

      {/* Decks */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Your Decks</h2>

          <Link to="/decks">
            View all
          </Link>
        </div>

        {decks.length === 0 ? (
          <EmptyState message="You don't have any decks yet." />
        ) : (
          <div className="dashboard-decks">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="dashboard-deck-card"
              >
                <div>
                  <h3>{deck.title}</h3>

                  <p>
                    {deck.description ||
                      "No description"}
                  </p>

                  <small>
                    {deck.card_count} cards ·{" "}
                    {deck.due_count} due
                  </small>
                </div>

                <div className="deck-card-actions">
                  {deck.due_count > 0 ? (
                    <Link
                      to={`/decks/${deck.id}/study`}
                      className="primary-button"
                    >
                      Study
                    </Link>
                  ) : (
                    <span className="no-due">
                      No cards due
                    </span>
                  )}

                  <Link
                    to={`/decks/${deck.id}`}
                    className="secondary-button"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;