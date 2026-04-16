import { useEffect, useState } from "react";
import { fetchJson } from "../api/apiClient.js";
import ConfirmationPopup from "../components/ConfirmationPopup.jsx";
import AdminEntityTable from "../components/AdminEntityTable.jsx";
import AdminModal from "../components/AdminModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

function Dashboard() {
  const { setNotification } = useAuth();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [confirmState, setConfirmState] = useState({
    open: false,
    target: null,
    type: "",
  });
  const [editState, setEditState] = useState({
    open: false,
    type: "",
    item: null,
    form: {},
    saving: false,
    error: "",
  });
  const [viewState, setViewState] = useState({
    open: false,
    message: null,
  });

  const loadAdminData = async () => {
    try {
      const [userData, postData, messageData] = await Promise.all([
        fetchJson("/admin/users"),
        fetchJson("/admin/posts"),
        fetchJson("/admin/messages"),
      ]);
      setUsers(userData);
      setPosts(postData);
      setMessages(messageData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const openDelete = (type, item) => {
    setConfirmState({ open: true, target: item, type });
  };

  const closeDelete = () =>
    setConfirmState({ open: false, target: null, type: "" });

  const openViewMessage = (message) => {
    setViewState({ open: true, message });
  };

  const closeViewMessage = () =>
    setViewState({ open: false, message: null });

  const deleteResource = async () => {
    try {
      let endpoint = "";
      if (confirmState.type === "user")
        endpoint = `/admin/users/${confirmState.target._id}`;
      if (confirmState.type === "post")
        endpoint = `/admin/posts/${confirmState.target._id}`;
      if (confirmState.type === "message")
        endpoint = `/admin/messages/${confirmState.target._id}`;

      await fetchJson(endpoint, { method: "DELETE" });

      if (confirmState.type === "user") {
        setUsers((prev) =>
          prev.filter((user) => user._id !== confirmState.target._id),
        );
      }
      if (confirmState.type === "post") {
        setPosts((prev) =>
          prev.filter((post) => post._id !== confirmState.target._id),
        );
      }
      if (confirmState.type === "message") {
        setMessages((prev) =>
          prev.filter((message) => message._id !== confirmState.target._id),
        );
      }

      setNotification({
        type: "success",
        message: `${confirmState.type} deleted successfully.`,
      });
    } catch (err) {
      setError(err.message);
      setNotification({ type: "error", message: err.message });
    } finally {
      closeDelete();
    }
  };

  const openEdit = (type, item) => {
    if (type === "user") {
      setEditState({
        open: true,
        type,
        item,
        form: {
          fullname: item.fullname,
          username: item.username,
          email: item.email,
          role: item.role,
        },
        saving: false,
        error: "",
      });
    }
    if (type === "post") {
      setEditState({
        open: true,
        type,
        item,
        form: {
          caption: item.caption,
          imageUrl: item.imageUrl,
        },
        saving: false,
        error: "",
      });
    }
  };

  const closeEdit = () =>
    setEditState({
      open: false,
      type: "",
      item: null,
      form: {},
      saving: false,
      error: "",
    });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditState((prev) => ({
      ...prev,
      form: { ...prev.form, [name]: value },
    }));
  };

  const saveEdit = async () => {
    try {
      setEditState((prev) => ({ ...prev, saving: true, error: "" }));
      if (editState.type === "user") {
        const updated = await fetchJson(`/admin/users/${editState.item._id}`, {
          method: "PUT",
          body: JSON.stringify(editState.form),
        });
        setUsers((prev) =>
          prev.map((user) =>
            user._id === updated.id ? { ...user, ...updated } : user,
          ),
        );
        setNotification({
          type: "success",
          message: "User updated successfully.",
        });
      }
      if (editState.type === "post") {
        const updated = await fetchJson(`/posts/${editState.item._id}`, {
          method: "PUT",
          body: JSON.stringify(editState.form),
        });
        setPosts((prev) =>
          prev.map((post) => (post._id === updated._id ? updated : post)),
        );
        setNotification({
          type: "success",
          message: "Post updated successfully.",
        });
      }
      closeEdit();
    } catch (err) {
      setEditState((prev) => ({ ...prev, error: err.message }));
      setNotification({ type: "error", message: err.message });
    } finally {
      setEditState((prev) => ({ ...prev, saving: false }));
    }
  };

  return (
    <article className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h2 className="h2 article-title">Admin Dashboard</h2>
          <p className="admin-description">
            Manage users, posts, and incoming messages from a single secure
            panel.
          </p>
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}

      <div className="admin-sections">
        <AdminEntityTable
          title="Users"
          subtitle={`Total users: ${users.length}`}
          rows={users}
          columns={[
            { title: "Name", key: "fullname" },
            { title: "Username", key: "username" },
            { title: "Email", key: "email" },
            { title: "Role", key: "role" },
          ]}
          onEdit={(item) => openEdit("user", item)}
          onDelete={(item) => openDelete("user", item)}
          emptyLabel="No users found"
        />

        <AdminEntityTable
          title="Posts"
          subtitle={`Total posts: ${posts.length}`}
          rows={posts}
          columns={[
            {
              title: "Author",
              key: "user",
              render: (post) => post.user?.fullname ?? "Unknown",
            },
            {
              title: "Caption",
              key: "caption",
              render: (post) => post.caption,
            },
            {
              title: "Image URL",
              key: "imageUrl",
              render: (post) => (
                <a href={post.imageUrl} target="_blank" rel="noreferrer">
                  View
                </a>
              ),
            },
            {
              title: "Published",
              key: "createdAt",
              render: (post) => formatDate(post.createdAt),
            },
          ]}
          onEdit={(item) => openEdit("post", item)}
          onDelete={(item) => openDelete("post", item)}
          emptyLabel="No posts published yet"
        />

        <AdminEntityTable
          title="Messages"
          subtitle={`Total messages: ${messages.length}`}
          rows={messages}
          columns={[
            { title: "From", key: "fullname" },
            {
              title: "Email",
              key: "email",
              render: (msg) => (
                <a href={`mailto:${msg.email}`} className="admin-email-link">
                  {msg.email}
                </a>
              ),
            },
            {
              title: "Subject",
              key: "subject",
              render: (msg) => msg.subject?.substring(0, 50) + (msg.subject?.length > 50 ? "..." : ""),
            },
            {
              title: "Received",
              key: "createdAt",
              render: (message) => formatDate(message.createdAt),
            },
          ]}
          onView={(item) => openViewMessage(item)}
          onDelete={(item) => openDelete("message", item)}
          emptyLabel="No messages received"
        />
      </div>

      <ConfirmationPopup
        isOpen={confirmState.open}
        title="Confirm delete"
        message="Please confirm if you want to delete this"
        onConfirm={deleteResource}
        onClose={closeDelete}
      />

      <AdminModal
        title={editState.type === "user" ? "Edit user" : "Edit post"}
        isOpen={editState.open}
        onClose={closeEdit}
        onSave={saveEdit}
        saveLabel={editState.saving ? "Saving..." : "Save changes"}
      >
        {editState.error && <p className="error-message">{editState.error}</p>}

        {editState.type === "user" ? (
          <div className="modal-form">
            <label>
              Full name
              <input
                name="fullname"
                value={editState.form.fullname || ""}
                onChange={handleEditChange}
                className="form-input"
              />
            </label>
            <label>
              Username
              <input
                name="username"
                value={editState.form.username || ""}
                onChange={handleEditChange}
                className="form-input"
              />
            </label>
            <label>
              Email
              <input
                name="email"
                value={editState.form.email || ""}
                onChange={handleEditChange}
                className="form-input"
              />
            </label>
            <label>
              Role
              <select
                name="role"
                value={editState.form.role || "member"}
                onChange={handleEditChange}
                className="form-input"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
        ) : (
          <div className="modal-form">
            <label>
              Caption
              <textarea
                name="caption"
                value={editState.form.caption || ""}
                onChange={handleEditChange}
                className="form-input"
                rows="3"
              />
            </label>
            <label>
              Image URL
              <input
                name="imageUrl"
                value={editState.form.imageUrl || ""}
                onChange={handleEditChange}
                className="form-input"
              />
            </label>
          </div>
        )}
      </AdminModal>

      {/* Message View Modal */}
      {viewState.open && viewState.message && (
        <div className="modal-backdrop" onClick={closeViewMessage}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Message Details</h3>
              <button className="modal-close" onClick={closeViewMessage}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="message-detail">
                <div className="message-field">
                  <span className="message-label">From:</span>
                  <span className="message-value">{viewState.message.fullname}</span>
                </div>
                <div className="message-field">
                  <span className="message-label">Email:</span>
                  <span className="message-value">
                    <a href={`mailto:${viewState.message.email}`}>
                      {viewState.message.email}
                    </a>
                  </span>
                </div>
                {viewState.message.subject && (
                  <div className="message-field">
                    <span className="message-label">Subject:</span>
                    <span className="message-value">{viewState.message.subject}</span>
                  </div>
                )}
                <div className="message-field">
                  <span className="message-label">Received:</span>
                  <span className="message-value">{formatDate(viewState.message.createdAt)}</span>
                </div>
                <div className="message-full-content">
                  <h4>Message</h4>
                  <p>{viewState.message.message || <em>No message content</em>}</p>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="button button-secondary" onClick={closeViewMessage}>
                Close
              </button>
              <a
                href={`mailto:${viewState.message.email}?subject=Re: ${viewState.message.subject || ''}`}
                className="button button-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Reply
              </a>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default Dashboard;
