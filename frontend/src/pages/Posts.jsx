import { useEffect, useState } from "react";
import { fetchJson } from "../api/apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";
import PostCard from "../components/PostCard.jsx";

function Posts() {
  const { user, setNotification } = useAuth();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    caption: "",
    description: "",
    imageFile: null,
  });
  const [error, setError] = useState("");

  const loadPosts = async () => {
    try {
      const data = await fetchJson("/posts");
      setPosts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const createPost = async (e) => {
    e.preventDefault();
    try {
      let imageData = null;
      if (form.imageFile) {
        imageData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const maxWidth = 800;
              const maxHeight = 600;
              let width = img.width;
              let height = img.height;
              if (width > height) {
                if (width > maxWidth) {
                  height = Math.round((height * maxWidth) / width);
                  width = maxWidth;
                }
              } else {
                if (height > maxHeight) {
                  width = Math.round((width * maxHeight) / height);
                  height = maxHeight;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.7));
            };
            img.src = reader.result;
          };
          reader.onerror = reject;
          reader.readAsDataURL(form.imageFile);
        });
      }

      const data = await fetchJson("/posts", {
        method: "POST",
        body: JSON.stringify({
          caption: form.caption,
          description: form.description,
          imageData,
        }),
      });
      setPosts((prev) => [data, ...prev]);
      setForm({ caption: "", description: "", imageFile: null });
      setError("");
      setNotification({
        type: "success",
        message: "Post created successfully.",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await fetchJson(`/posts/${postId}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      setNotification({
        type: "success",
        message: "Post deleted successfully.",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <article className="posts-page">
      <header>
        <h2 className="h2 article-title">Community Posts</h2>
      </header>

      {error && <p className="error-message">{error}</p>}

      {user ? (
        <form className="form post-form" onSubmit={createPost}>
          <div className="form-group">
            <input
              type="text"
              name="caption"
              className="form-input"
              placeholder="Post Title"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              className="form-input"
              placeholder="Write your post description here..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows="4"
            />
          </div>

          <div className="form-group">
            <input
              type="file"
              name="image"
              className="form-input"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, imageFile: e.target.files?.[0] || null })
              }
              required
            />
          </div>

          <button type="submit" className="form-btn">
            <ion-icon name="add-circle-outline"></ion-icon>
            <span>Create Post</span>
          </button>
        </form>
      ) : (
        <p className="notice">Login to create posts and add comments.</p>
      )}

      <section className="posts-list">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            user={user}
            onDelete={handleDeletePost}
            setNotification={setNotification}
          />
        ))}
      </section>
    </article>
  );
}

export default Posts;
