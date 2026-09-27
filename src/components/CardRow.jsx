import { Link } from "react-router-dom";
import BoxBadge from "./BoxBadge";

function CardRow({ card, onDelete }) {
  return (
    <div className="card-row">
      <div className="card-content">
        <strong>{card.front}</strong>

        <p>{card.back}</p>

        <BoxBadge box={card.box} />

        <small>
          Next review:{" "}
          {new Date(card.next_review_at).toLocaleString()}
        </small>
      </div>

      <div className="card-actions">
        <Link to={`/cards/${card.id}/edit`}>
          Edit
        </Link>

        <button onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default CardRow;