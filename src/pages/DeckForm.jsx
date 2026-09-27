import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createDeck, getDeck, updateDeck } from "../api/decks";
import Loader from "../components/Loader";

function DeckForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "OTHER",
    is_archived: false,
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const loadDeck = async () => {
      try {
        const response = await getDeck(id);

        setForm({
          title: response.data.title || "",
          description: response.data.description || "",
          subject: response.data.subject || "OTHER",
          is_archived: response.data.is_archived || false,
        });
      } catch (err) {
        setGeneralError(
          err.response?.data?.detail || "Failed to load deck."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDeck();
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
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
        await updateDeck(id, form);
        navigate(`/decks/${id}`);
      } else {
        const response = await createDeck(form);
        navigate(`/decks/${response.data.id}`);
      }
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setGeneralError("Failed to save deck.");
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
          <h1>{isEdit ? "Edit Deck" : "Create Deck"}</h1>

          <p>
            {isEdit
              ? "Update your deck information."
              : "Create a new study deck."}
          </p>
        </div>
      </div>

      {generalError && (
        <div className="form-error">
          {generalError}
        </div>
      )}

      <form className="deck-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Python Basics"
            maxLength={120}
            required
          />

          {errors.title && (
            <p className="field-error">
              {Array.isArray(errors.title)
                ? errors.title[0]
                : errors.title}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe what this deck is about..."
            rows="5"
          />

          {errors.description && (
            <p className="field-error">
              {Array.isArray(errors.description)
                ? errors.description[0]
                : errors.description}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="subject">
            Subject
          </label>

          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
          >
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

          {errors.subject && (
            <p className="field-error">
              {Array.isArray(errors.subject)
                ? errors.subject[0]
                : errors.subject}
            </p>
          )}
        </div>

        {isEdit && (
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="is_archived"
                checked={form.is_archived}
                onChange={handleChange}
              />

              <span>Archive this deck</span>
            </label>
          </div>
        )}

        <div className="form-actions">
          <Link
            to={isEdit ? `/decks/${id}` : "/decks"}
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
              ? "Update Deck"
              : "Create Deck"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeckForm;