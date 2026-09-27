import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDecks, deleteDeck } from "../api/decks";
import DeckCard from "../components/DeckCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

function DeckList() {
  const [decks, setDecks] = useState([]);

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [archived, setArchived] = useState("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const loadDecks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDecks({
        search,
        subject,
        is_archived: archived,
        page,
      });

      setDecks(response.data.results || []);
      setNextPage(response.data.next);
      setPreviousPage(response.data.previous);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to load decks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecks();
  }, [search, subject, archived, page]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSubject = (e) => {
    setSubject(e.target.value);
    setPage(1);
  };

  const handleArchived = (e) => {
    setArchived(e.target.value);
    setPage(1);
  };

  const handleDelete = async (deck) => {
    const confirmed = window.confirm(
      `Delete "${deck.title}"? All cards in this deck will also be deleted.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDeck(deck.id);

      if (decks.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        loadDecks();
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to delete deck."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="deck-list-header">
        <div>
          <h1>Your Decks</h1>
          <p>Manage your study decks.</p>
        </div>

        <Link
          to="/decks/new"
          className="primary-button"
        >
          + New Deck
        </Link>
      </div>

      <div className="deck-filters">
        <input
          type="text"
          placeholder="Search decks..."
          value={search}
          onChange={handleSearch}
        />

        <select
          value={subject}
          onChange={handleSubject}
        >
          <option value="">All Subjects</option>
          <option value="PROGRAMMING">
            Programming
          </option>
          <option value="LANGUAGE">
            Language
          </option>
          <option value="ACADEMIC">
            Academic
          </option>
          <option value="INTERVIEW">
            Interview
          </option>
          <option value="OTHER">
            Other
          </option>
        </select>

        <select
          value={archived}
          onChange={handleArchived}
        >
          <option value="">All Decks</option>
          <option value="false">
            Active
          </option>
          <option value="true">
            Archived
          </option>
        </select>
      </div>

      {loading && <Loader />}

      {!loading && error && (
        <ErrorState message={error} />
      )}

      {!loading && !error && decks.length === 0 && (
        <EmptyState message="No decks found." />
      )}

      {!loading && !error && decks.length > 0 && (
        <>
          <div className="deck-list">
            {decks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={!previousPage}
              onClick={() =>
                setPage((currentPage) =>
                  Math.max(currentPage - 1, 1)
                )
              }
            >
              Previous
            </button>

            <span>Page {page}</span>

            <button
              disabled={!nextPage}
              onClick={() =>
                setPage((currentPage) =>
                  currentPage + 1
                )
              }
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DeckList;