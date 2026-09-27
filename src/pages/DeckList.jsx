import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDecks, deleteDeck } from "../api/decks";
import DeckCard from "../components/DeckCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ConfirmModal from "../components/ConfirmModal";

function DeckList() {
  const [decks, setDecks] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [archived, setArchived] = useState("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
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

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      setError("");

      await deleteDeck(deleteTarget.id);

      setDeleteTarget(null);

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
    } finally {
      setDeleteLoading(false);
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
                onDelete={() => setDeleteTarget(deck)}
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

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Deck?"
        message={
          deleteTarget
            ? `Deleting "${deleteTarget.title}" will also delete all cards in this deck.`
            : ""
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

    </div>
  );
}

export default DeckList;