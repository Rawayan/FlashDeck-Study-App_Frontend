import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getStudyCards } from "../api/decks";
import { reviewCard } from "../api/cards";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import BoxBadge from "../components/BoxBadge";

function Study() {
  const { id } = useParams();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showAnswer, setShowAnswer] = useState(false);

  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState("");

  const [completed, setCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);

  const loadStudy = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getStudyCards(id);

      setDeck(response.data.deck);
      setCards(response.data.cards || []);
      setCurrentIndex(0);
      setShowAnswer(false);
      setCompleted(false);
      setCorrectCount(0);
      setMissedCount(0);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to load study cards."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudy();
  }, [id]);

  const handleReview = async (correct) => {
    const currentCard = cards[currentIndex];

    if (!currentCard || reviewing) return;

    try {
      setReviewing(true);
      setError("");

      await reviewCard(currentCard.id, correct);

      if (correct) {
        setCorrectCount((count) => count + 1);
      } else {
        setMissedCount((count) => count + 1);
      }

      if (currentIndex + 1 < cards.length) {
        setCurrentIndex((index) => index + 1);
        setShowAnswer(false);
      } else {
        setCompleted(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to review card."
      );
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
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

  if (completed) {
    const totalReviewed =
      correctCount + missedCount;

    return (
      <div className="page-container study-page">
        <div className="study-finished">
          <h1>Study Complete!</h1>

          <p>
            You reviewed {totalReviewed} card
            {totalReviewed !== 1 ? "s" : ""}.
          </p>

          <div className="study-summary">
            <div>
              <strong>{correctCount}</strong>
              <span>Got it</span>
            </div>

            <div>
              <strong>{missedCount}</strong>
              <span>Missed</span>
            </div>
          </div>

          <div className="study-finished-actions">
            <button
              className="primary-button"
              onClick={loadStudy}
            >
              Study Again
            </button>

            <Link
              to={`/decks/${id}`}
              className="secondary-button"
            >
              Back to Deck
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="page-container study-page">
        <div className="study-empty">
          <h1>{deck?.title}</h1>

          <h2>No Cards Due</h2>

          <p>
            There are no cards due for review right now.
          </p>

          <Link
            to={`/decks/${id}`}
            className="primary-button"
          >
            Back to Deck
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const progress =
    ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="page-container study-page">
      <div className="study-header">
        <div>
          <h1>{deck?.title}</h1>
          <p>
            Card {currentIndex + 1} of {cards.length}
          </p>
        </div>

        <Link
          to={`/decks/${id}`}
          className="secondary-button"
        >
          Exit Study
        </Link>
      </div>

      <div className="study-progress">
        <div
          className="study-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      {error && (
        <ErrorState message={error} />
      )}

      <div className="study-card">
        <div className="study-card-top">
          <BoxBadge box={currentCard.box} />

          <span>
            {currentIndex + 1} / {cards.length}
          </span>
        </div>

        <div className="study-question">
          <span className="study-label">
            Question
          </span>

          <h2>{currentCard.front}</h2>
        </div>

        {!showAnswer ? (
          <div className="show-answer-section">
            {currentCard.hint && (
              <p className="study-hint">
                <strong>Hint:</strong>{" "}
                {currentCard.hint}
              </p>
            )}

            <button
              className="primary-button show-answer-button"
              onClick={() => setShowAnswer(true)}
            >
              Show Answer
            </button>
          </div>
        ) : (
          <div className="study-answer-section">
            <span className="study-label">
              Answer
            </span>

            <div className="study-answer">
              {currentCard.back}
            </div>

            <div className="review-actions">
              <button
                className="missed-button"
                disabled={reviewing}
                onClick={() => handleReview(false)}
              >
                {reviewing ? "Saving..." : "Missed"}
              </button>

              <button
                className="correct-button"
                disabled={reviewing}
                onClick={() => handleReview(true)}
              >
                {reviewing ? "Saving..." : "Got it"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Study;