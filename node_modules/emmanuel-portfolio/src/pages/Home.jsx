// src/pages/Home.jsx
// 📁 IMAGE PLACEMENT INSTRUCTIONS:
// Place the following image in: public/assets/images/
//   → my-avatar.png   (used in the hero banner)

import { useEffect, useState } from "react";
import ServiceList from "../components/ServiceList";
import PostCard from "../components/PostCard.jsx";
import { fetchJson } from "../api/apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";

function Home() {
  const [posts, setPosts] = useState([]);
  const { user, setNotification } = useAuth();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchJson("/posts");
        setPosts(data);
      } catch (err) {
        console.error("Failed to load posts", err);
      }
    };
    loadPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await fetchJson(`/posts/${postId}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      setNotification({
        type: "success",
        message: "Post deleted successfully.",
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message,
      });
    }
  };

  return (
    <article className="home" data-page="home">
      <header>
        <h2 className="h2 article-title">Welcome</h2>
      </header>

      {/* ── Latest Posts ─────────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="latest-posts">
          <h3 className="h3 section-title">Latest Posts</h3>
          <div className="posts-list">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                user={user}
                onDelete={handleDeletePost}
                setNotification={setNotification}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-content">
          <h3 className="h3">Crafting Digital Experiences</h3>
          <p className="hero-text">
            I'm a passionate Web developer specializing in creating beautiful,
            functional, and user-centered digital experiences. With expertise in
            modern web technologies, I transform ideas into reality through
            clean code and innovative design solutions.
          </p>
        </div>

        <figure className="hero-banner">
          <img
            src="/assets/images/my-avatar.png"
            alt="Emmanuel Pascua working"
            loading="lazy"
          />
        </figure>
      </section>

      {/* ── Key Highlights ───────────────────────────────────────────── */}
      <section className="highlights">
        <h3 className="h3 section-title">What I Bring to the Table</h3>
        <ul className="highlights-list">
          {[
            "Over 3 years of experience in web development and SEO optimization",
            "Expert in modern frameworks including React, Vue, and Angular",
            "Proven track record with Fortune 500 companies and innovative startups",
            "Committed to accessibility standards and responsive design principles",
            "Continuous learner staying updated with latest web technologies and trends",
          ].map((item, i) => (
            <li key={i} className="highlight-item">
              <ion-icon name="checkmark-circle-outline"></ion-icon>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Services ─────────────────────────────────────────────────── */}
      <ServiceList />
    </article>
  );
}

export default Home;
