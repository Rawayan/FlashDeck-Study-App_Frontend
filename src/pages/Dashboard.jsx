import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDecks, getStats } from "../api/decks";
import { useAuth } from "../auth/AuthContext";
import StatCard from "../components/StatCard";
import BoxBadge from "../components/BoxBadge";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

const DueIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="stat-icon-svg"
  >
    <path
      d="M12 7v5.5l3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const CardsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="stat-icon-svg"
  >
    <path
      d="M19 3H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M8 7h8v2H8zM8 11h8v2H8zM8 15h5v2H8z"
      fill="currentColor"
    />
  </svg>
);

const MasteredIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="stat-icon-svg"
  >
    <path
      d="M12 17.27L18.18 21l-5.33-4.18L12 17.27zm0 0L5.82 21 11.14 15.33 12 17.27z"
      fill="currentColor"
    />
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7.91 14.14 4 9.27l6.91-1.01L12 2z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

const AccuracyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="stat-icon-svg"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path
      d="M12 7v5l2 3"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="2"
      fill="currentColor"
    />
  </svg>
);

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [decks, setDecks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();

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

  const displayName = user?.username || "";

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1>
            Welcome{displayName ? `, ${displayName}` : ""}
          </h1>
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
          icon={<DueIcon />}
        />

        <StatCard
          title="Total Cards"
          value={stats?.cards ?? 0}
          icon={<CardsIcon />}
        />

        <StatCard
          title="Mastered"
          value={stats?.mastered ?? 0}
          icon={<MasteredIcon />}
        />

        <StatCard
          title="Accuracy"
          value={`${stats?.accuracy ?? 0}`}
          unit="%"
          icon={<AccuracyIcon />}
        />
      </section>

      {/* Box Distribution */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Box Distribution</h2>

          <Link to="/decks">
            View all decks
          </Link>
        </div>

        <div className="box-grid">
          {[1, 2, 3, 4, 5].map((box) => (
            <div
              key={box}
              className="box-stat"
            >
              <div
                className={`box-stat-border border-${box}`}
              />

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
            {decks.map((deck, index) => (
              <div
                key={deck.id}
                className="card-animate dashboard-deck-card"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
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
