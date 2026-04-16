import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchJson } from "../api/apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import FormInput from "../components/FormInput.jsx";
import ChangePasswordCard from "../components/ChangePasswordCard.jsx";
import { getPasswordStrength } from "../utils/passwordUtils.js";

function Profile() {
  const { user, updateUser, setNotification } = useAuth();
  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
    role: "",
    profilePicture: "",
  });
  const [formState, setFormState] = useState({
    fullname: "",
    email: "",
    profilePicture: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Compute password validation directly from formState to avoid callback loops
  const passwordValidation = useMemo(() => {
    const { currentPassword, newPassword, confirmPassword } = formState;
    const hasPasswordInput = currentPassword || newPassword || confirmPassword;

    if (!hasPasswordInput) {
      return {
        valid: true,
        strengthData: { score: 0, label: "", className: "" },
        passwordsMatch: false,
      };
    }

    const strengthData = getPasswordStrength(newPassword);
    const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
    const valid =
      currentPassword &&
      newPassword &&
      confirmPassword &&
      passwordsMatch &&
      strengthData.score >= 2;

    return { valid, strengthData, passwordsMatch };
  }, [formState.currentPassword, formState.newPassword, formState.confirmPassword]);

  const passwordSectionActive = !!(
    formState.currentPassword ||
    formState.newPassword ||
    formState.confirmPassword
  );

  const saveDisabled =
    saving || (editMode && passwordSectionActive && !passwordValidation.valid);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchJson("/auth/profile");
        setProfile(data);
        setFormState({
          fullname: data.fullname || "",
          email: data.email || "",
          profilePicture: data.profilePicture || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        setNotification({ type: "error", message: error.message });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?._id]); // Only re-run when user ID changes

  const handleToggleEdit = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleCancel = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      fullname: profile.fullname || "",
      email: profile.email || "",
      profilePicture: profile.profilePicture || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setEditMode(false);
  }, [profile.fullname, profile.email, profile.profilePicture]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((image) => {
    setFormState((prev) => ({ ...prev, profilePicture: image }));
  }, []);

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!formState.fullname.trim() || !formState.email.trim()) {
      setNotification({
        type: "error",
        message: "Name and email are required.",
      });
      return;
    }

    if (!validateEmail(formState.email)) {
      setNotification({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (
      formState.newPassword &&
      formState.newPassword !== formState.confirmPassword
    ) {
      setNotification({
        type: "error",
        message: "New password and confirmation do not match.",
      });
      return;
    }

    setSaving(true);

    try {
      const updatedUser = await fetchJson("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullname: formState.fullname.trim(),
          email: formState.email.trim().toLowerCase(),
          profilePicture: formState.profilePicture,
        }),
      });

      if (formState.currentPassword || formState.newPassword) {
        if (!formState.currentPassword || !formState.newPassword) {
          throw new Error(
            "Both current and new password are required to change your password.",
          );
        }

        await fetchJson("/auth/profile/password", {
          method: "PUT",
          body: JSON.stringify({
            currentPassword: formState.currentPassword,
            newPassword: formState.newPassword,
          }),
        });

        setNotification({
          type: "success",
          message: "Password changed successfully.",
        });
      }

      setProfile(updatedUser);
      updateUser(updatedUser);
      setEditMode(false);
      setFormState((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setNotification({
        type: "success",
        message: "Profile updated successfully.",
      });
    } catch (error) {
      setNotification({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <article className="profile-page">
        <div className="profile-card">
          <p>Loading profile...</p>
        </div>
      </article>
    );
  }

  if (!user) {
    return (
      <article className="profile-page">
        <div className="profile-card">
          <p>Please log in to view your profile.</p>
        </div>
      </article>
    );
  }

  return (
    <article className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <p className="section-label">My Profile</p>
            <h2>Profile Management</h2>
          </div>
          {!editMode && (
            <button
              type="button"
              className="button button-sm"
              onClick={handleToggleEdit}
            >
              Edit Profile
            </button>
          )}
        </div>

        <form className="profile-form" onSubmit={handleSave}>
          <div className="profile-grid">
            <ImageUpload
              label="Profile Picture"
              image={formState.profilePicture}
              onImageChange={handleImageChange}
              disabled={!editMode}
            />

            <div className="profile-fields">
              <FormInput
                id="fullname"
                label="Full Name"
                name="fullname"
                value={formState.fullname}
                onChange={handleChange}
                placeholder="Your name"
                disabled={!editMode}
                required
              />
              <FormInput
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={!editMode}
                required
              />
              <div className="profile-detail-row">
                <span className="profile-detail-label">Role</span>
                <strong>{profile?.role || 'User'}</strong>
              </div>
            </div>
          </div>

          {editMode && (
            <ChangePasswordCard
              currentPassword={formState.currentPassword}
              newPassword={formState.newPassword}
              confirmPassword={formState.confirmPassword}
              onChange={handleChange}
              disabled={!editMode || saving}
              strengthData={passwordValidation.strengthData}
              passwordsMatch={passwordValidation.passwordsMatch}
            />
          )}

          {editMode && (
            <div className="profile-actions">
              <button
                type="submit"
                className="button button-primary"
                disabled={saveDisabled}
              >
                {saving ? "Saving changes..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </article>
  );
}

export default Profile;
