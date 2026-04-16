function ConfirmationPopup({ title, message, isOpen, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="popup-actions">
          <button className="button button-secondary" onClick={onClose}>
            Back
          </button>
          <button className="button button-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPopup;
