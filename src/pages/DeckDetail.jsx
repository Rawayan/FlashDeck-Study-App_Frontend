import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDeck } from "../api/decks";
import { getCards, deleteCard } from "../api/cards";
import CardRow from "../components/CardRow";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ConfirmModal from "../components/ConfirmModal";

function DeckDetail() {
  const { id } = useParams();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);

  const [search, setSearch] = useState("");
  const [box, setBox] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadDeck = async () => {
    try {
      const response = await getDeck(id);
      setDeck(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load deck."
      );
    }
  };

  const loadCards = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        deck: id,
        page,
      };

      if (search.trim()) {
        params.search = search;
      }

      if (box) {
        params.box = box;
      }

      const response = await getCards(params);

      setCards(response.data.results || []);
      setNext(response.data.next);
      setPrevious(response.data.previous);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load cards."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeck();
  }, [id]);

  useEffect(() => {
    loadCards();
  }, [id, page, search, box]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleBoxChange = (event) => {
    setBox(event.target.value);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteCard(deleteTarget.id);

      setDeleteTarget(null);

      if (cards.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        loadCards();
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to delete card."
      );
      setDeleteTarget(null);
    }
  };

  if (loading && !deck) {
    return (
      <div className="page-container">
        <Loader />
      </div>
    );
  }

  if (error && !deck) {
    return (
      <div className="page-container">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="deck-detail-header">
        <div>
          <h1>{deck?.title}</h1>

          <p>
            {deck?.description || "No description"}
          </p>

          <small>
            Subject: {deck?.subject}
          </small>
        </div>

        <div className="deck-detail-actions">
          <Link
            to={`/decks/${id}/study`}
            className="primary-button"
          >
            Study
          </Link>

          <Link
            to={`/decks/${id}/cards/new`}
            className="secondary-button"
          >
            + Add Card
          </Link>

          <Link
            to={`/decks/${id}/edit`}
            className="secondary-button"
          >
            Edit Deck
          </Link>
        </div>
      </div>

      <div className="card-list-header">
        <div>
          <h2>Cards</h2>
          <p>
            Manage the cards in this deck.
          </p>
        </div>
      </div>

      <div className="card-filters">
        <input
          type="text"
          placeholder="Search front or back..."
          value={search}
          onChange={handleSearchChange}
        />

        <select value={box} onChange={handleBoxChange}>
          <option value="">All Boxes</option>
          <option value="1">Box 1</option>
          <option value="2">Box 2</option>
          <option value="3">Box 3</option>
          <option value="4">Box 4</option>
          <option value="5">Box 5</option>
        </select>
      </div>

      {error && (
        <ErrorState message={error} />
      )}

      {loading ? (
        <Loader />
      ) : cards.length === 0 ? (
        <EmptyState
          message={
            search || box
              ? "No cards match your filters."
              : "This deck has no cards yet."
          }
        />
      ) : (
        <>
          <div className="card-list">
            {cards.map((card) => (
              <CardRow
                key={card.id}
                card={card}
                onDelete={() => setDeleteTarget(card)}
              />
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={!previous}
              onClick={() =>
                setPage((currentPage) => currentPage - 1)
              }
            >
              Previous
            </button>

            <span>Page {page}</span>

            <button
              disabled={!next}
              onClick={() =>
                setPage((currentPage) => currentPage + 1)
              }
            >
              Next
            </button>
          </div>
        </>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Card?"
        message={
          deleteTarget
            ? `Are you sure you want to delete this card?`
            : ""
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default DeckDetail;