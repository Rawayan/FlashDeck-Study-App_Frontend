function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="confirm-modal">
        <h3>{title}</h3>

        <p>{message}</p>

        <div className="modal-actions">
          <button onClick={onCancel}>
            Cancel
          </button>

          <button onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;