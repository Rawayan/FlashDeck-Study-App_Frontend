function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onCancel}
    >
      <div
        className="confirm-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <h3>{title}</h3>

        <p>{message}</p>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;