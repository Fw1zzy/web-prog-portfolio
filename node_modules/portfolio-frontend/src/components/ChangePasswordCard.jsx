import { useState } from "react";

function ChangePasswordCard({
  currentPassword,
  newPassword,
  confirmPassword,
  onChange,
  disabled,
  strengthData,
  passwordsMatch,
}) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggle = (setter) => {
    setter((prev) => !prev);
  };

  return (
    <div className="password-card">
      <div className="password-card-header">
        <div>
          <p className="section-label">Change Password</p>
          <h3 className="password-title">Secure your account</h3>
        </div>
        <p className="password-card-note">
          Enter your current password first. New passwords must be at least 8
          characters long.
        </p>
      </div>

      <div className="password-inputs">
        <div className="password-field">
          <label htmlFor="currentPassword" className="form-label">
            Current Password
          </label>
          <div className="password-input-wrapper">
            <input
              id="currentPassword"
              name="currentPassword"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={onChange}
              placeholder="Enter current password"
              disabled={disabled}
              className="form-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => handleToggle(setShowCurrent)}
              tabIndex={-1}
            >
              {showCurrent ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="password-field">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <div className="password-input-wrapper">
            <input
              id="newPassword"
              name="newPassword"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={onChange}
              placeholder="Create a new password"
              disabled={disabled}
              className="form-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => handleToggle(setShowNew)}
              tabIndex={-1}
            >
              {showNew ? "Hide" : "Show"}
            </button>
          </div>
          {newPassword && (
            <div className={`password-strength ${strengthData.className}`}>
              <span className="strength-bullet"></span>
              <span>{strengthData.label || "Password strength"}</span>
            </div>
          )}
        </div>

        <div className="password-field">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm New Password
          </label>
          <div className="password-input-wrapper">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={onChange}
              placeholder="Confirm new password"
              disabled={disabled}
              className="form-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => handleToggle(setShowConfirm)}
              tabIndex={-1}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
          {confirmPassword && (
            <div
              className={`password-match ${passwordsMatch ? "match" : "mismatch"}`}
            >
              <ion-icon
                name={
                  passwordsMatch
                    ? "checkmark-circle-outline"
                    : "close-circle-outline"
                }
              ></ion-icon>
              <span>
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordCard;
