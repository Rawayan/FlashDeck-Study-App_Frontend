import { Link } from "react-router-dom";
import BoxBadge from "./BoxBadge";

function DeckCard({ deck, onDelete }) {
  return (
    <div className="deck-card">
      <div>
        <h3>{deck.title}</h3>

        <p>
          {deck.description || "No description"}
        </p>

        <small>
          Subject: {deck.subject}
        </small>

        <div className="deck-stats">
          <span>{deck.card_count} cards</span>
          <span>{deck.due_count} due</span>
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

        <button onClick={() => onDelete(deck)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default DeckCard;