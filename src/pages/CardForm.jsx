import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createCard,
  getCard,
  updateCard,
} from "../api/cards";
import { getDeck } from "../api/decks";
import Loader from "../components/Loader";

function CardForm() {
  const { id, deckId } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    deck: deckId || "",
    front: "",
    back: "",
    hint: "",
  });

  const [deck, setDeck] = useState(null);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isEdit) {
          const response = await getCard(id);

          setForm({
            deck: response.data.deck,
            front: response.data.front || "",
            back: response.data.back || "",
            hint: response.data.hint || "",
          });

          const deckResponse = await getDeck(response.data.deck);
          setDeck(deckResponse.data);
        } else if (deckId) {
          const response = await getDeck(deckId);
          setDeck(response.data);
        }
      } catch (err) {
        setGeneralError(
          err.response?.data?.detail ||
            "Failed to load card information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, deckId, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setErrors({});
    setGeneralError("");

    try {
      if (isEdit) {
        await updateCard(id, {
          front: form.front,
          back: form.back,
          hint: form.hint,
        });

        navigate(`/decks/${form.deck}`);
      } else {
        const response = await createCard({
          deck: form.deck,
          front: form.front,
          back: form.back,
          hint: form.hint,
        });

        navigate(`/decks/${response.data.deck}`);
      }
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setGeneralError("Failed to save card.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-header">
        <div>
          <h1>
            {isEdit ? "Edit Card" : "Create Card"}
          </h1>

          <p>
            {isEdit
              ? "Update the card content."
              : "Add a new card to your deck."}
          </p>
        </div>
      </div>

      {generalError && (
        <div className="form-error">
          {generalError}
        </div>
      )}

      {deck && (
        <div className="selected-deck">
          <strong>Deck:</strong> {deck.title}
        </div>
      )}

      <form
        className="deck-form card-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label htmlFor="front">
            Front
          </label>

          <textarea
            id="front"
            name="front"
            value={form.front}
            onChange={handleChange}
            placeholder="Enter the question..."
            rows="5"
            required
          />

          {errors.front && (
            <p className="field-error">
              {Array.isArray(errors.front)
                ? errors.front[0]
                : errors.front}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="back">
            Back
          </label>

          <textarea
            id="back"
            name="back"
            value={form.back}
            onChange={handleChange}
            placeholder="Enter the answer..."
            rows="7"
            required
          />

          {errors.back && (
            <p className="field-error">
              {Array.isArray(errors.back)
                ? errors.back[0]
                : errors.back}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="hint">
            Hint
          </label>

          <input
            id="hint"
            name="hint"
            type="text"
            value={form.hint}
            onChange={handleChange}
            placeholder="Optional hint..."
            maxLength={200}
          />

          {errors.hint && (
            <p className="field-error">
              {Array.isArray(errors.hint)
                ? errors.hint[0]
                : errors.hint}
            </p>
          )}
        </div>

        <div className="form-info">
          <p>
            Box and review schedule are managed
            automatically by FlashDeck.
          </p>
        </div>

        <div className="form-actions">
          <Link
            to={`/decks/${form.deck}`}
            className="secondary-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEdit
              ? "Update Card"
              : "Create Card"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CardForm;