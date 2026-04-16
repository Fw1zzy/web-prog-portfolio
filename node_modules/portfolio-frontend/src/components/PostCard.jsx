import { useState } from "react";
import { fetchJson } from "../api/apiClient.js";

function PostCard({ post, user, onDelete, setNotification }) {
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [likes, setLikes] = useState(post.likes ? post.likes.length : 0);
  const [isLiked, setIsLiked] = useState(
    post.likes ? post.likes.includes(user?.id) : false,
  );
  const [showComments, setShowComments] = useState(false);

  const loadComments = async () => {
    if (loadingComments) return;
    setLoadingComments(true);
    try {
      const data = await fetchJson(`/comments/${post._id}`);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleExpandPost = (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
      setShowComments(false);
    } else {
      setExpandedPost(postId);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      loadComments();
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const newComment = await fetchJson(`/comments/${post._id}`, {
        method: "POST",
        body: JSON.stringify({
          text: commentText,
        }),
      });
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      setNotification({
        type: "success",
        message: "Comment posted!",
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message,
      });
    }
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      const data = await fetchJson(`/posts/${post._id}/like`, {
        method: "PUT",
      });
      setLikes(data.likes);
      setIsLiked(data.isLiked);
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message,
      });
    }
  };

  const [imageError, setImageError] = useState(false);

  const getImageSrc = () => {
    if (!post.imageUrl || imageError) {
      return "/assets/images/placeholder.png";
    }
    // If imageUrl is just a filename (no protocol), prepend the base URL
    if (!post.imageUrl.startsWith("data:") && !post.imageUrl.startsWith("http") && !post.imageUrl.startsWith("/")) {
      return `/assets/images/${post.imageUrl}`;
    }
    return post.imageUrl;
  };

  return (
    <article className="post-card">
      <img
        src={getImageSrc()}
        alt={post.caption || "Post image"}
        className="post-image"
        onError={() => setImageError(true)}
      />
      <div className="post-details">
        <div className="post-header">
          <div>
            <p className="post-author">
              By {post.user.fullname || post.user.username}
            </p>
            <h4 className="post-caption">{post.caption}</h4>
          </div>
          <button
            className="expand-btn"
            onClick={() => handleExpandPost(post._id)}
          >
            <ion-icon
              name={expandedPost === post._id ? "chevron-up" : "chevron-down"}
            ></ion-icon>
          </button>
        </div>
        <time className="post-time">
          {new Date(post.createdAt).toLocaleDateString()}
        </time>

        {expandedPost === post._id && (
          <>
            {post.description && (
              <p className="post-description">{post.description}</p>
            )}

            <div className="post-actions">
              {user && (user.role === "admin" || user.id === post.user._id) && (
                <button
                  className="button button-danger button-sm"
                  onClick={() => onDelete(post._id)}
                >
                  <ion-icon name="trash-outline"></ion-icon>
                  Delete
                </button>
              )}
              <button
                className={`button button-sm ${isLiked ? "liked" : ""}`}
                onClick={handleLike}
                disabled={!user}
              >
                <ion-icon name={isLiked ? "heart" : "heart-outline"}></ion-icon>
                {likes} Like{likes !== 1 ? "s" : ""}
              </button>
            </div>

            <button
              className="button button-sm toggle-comments"
              onClick={toggleComments}
            >
              <ion-icon
                name={showComments ? "chevron-up" : "chevron-down"}
              ></ion-icon>
              {showComments ? "Hide" : "Show"} Comments ({comments.length})
            </button>

            {showComments && (
              <div className="comments-section">
                {user && (
                  <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <textarea
                      placeholder="Add a comment..."
                      className="form-input"
                      rows="2"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="button button-sm"
                      disabled={!commentText.trim()}
                    >
                      Post Comment
                    </button>
                  </form>
                )}

                {comments.length > 0 ? (
                  <div className="comments-list">
                    {comments.map((comment) => (
                      <div key={comment._id} className="comment-item">
                        <p className="comment-author">
                          <strong>
                            {comment.user.fullname || comment.user.username}
                          </strong>
                        </p>
                        <p className="comment-text">{comment.text}</p>
                        <time className="comment-time">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </time>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`no-comments ${commentText ? "hidden" : ""}`}>
                    {user ? "Be the first to comment!" : "Login to comment!"}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}

export default PostCard;
