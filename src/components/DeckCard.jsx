import { Link } from "react-router-dom";

function DeckCard({ deck, onDelete }) {
  return (
    <article className="deck-card">
      <div>
        <h3>{deck.title}</h3>

        <p>
          {deck.description || "No description"}
        </p>

        <small>
          Subject: {deck.subject}
        </small>

        <div className="deck-stats">
          <span>
            {deck.card_count} cards
          </span>

          <span>
            {deck.due_count} due
          </span>
        </div>
      </div>

      <div className="deck-actions">
        <Link to={`/decks/${deck.id}`}>
          View
        </Link>

        <Link to={`/decks/${deck.id}/edit`}>
          Edit
        </Link>

        <Link to={`/decks/${deck.id}/study`}>
          Study
        </Link>

        <button
          type="button"
          onClick={() => onDelete(deck)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default DeckCard;