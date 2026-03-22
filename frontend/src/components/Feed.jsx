import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api, imageUrl, clearAuth } from "../api";
import PostDetail from "./PostDetail";
import toast from "react-hot-toast";

/* ── icons ──────────────────────────────────────────────────────── */
const IcHeart = ({ s }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={s ? "#ef4444" : "none"} stroke={s ? "#ef4444" : "currentColor"} strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IcBookmark = ({ s }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={s ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const IcComment = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IcPlus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* ── time helper ───────────────────────────────────────────────── */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return `${Math.floor(d / 7)}w`;
}

/* ── main ──────────────────────────────────────────────────────── */
export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  /* fetch current user */
  useEffect(() => {
    api("/api/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => {
        clearAuth();
        navigate("/");
      });
  }, [navigate]);

  /* fetch posts */
  const fetchPosts = useCallback(async (p = 1) => {
    try {
      setLoading(true);
      const data = await api(`/api/uploads/feed?page=${p}&limit=10`);
      if (p === 1) setPosts(data.posts);
      else setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.page < data.pages);
    } catch {
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(1); }, [fetchPosts]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPosts(next);
  };

  /* interactions */
  const toggleLike = async (id) => {
    setPosts((p) =>
      p.map((x) =>
        x.id === id
          ? { ...x, is_liked: !x.is_liked, like_count: x.is_liked ? x.like_count - 1 : x.like_count + 1 }
          : x
      )
    );
    try {
      await api(`/api/uploads/${id}/like`, { method: "POST" });
    } catch {
      setPosts((p) =>
        p.map((x) =>
          x.id === id
            ? { ...x, is_liked: !x.is_liked, like_count: x.is_liked ? x.like_count - 1 : x.like_count + 1 }
            : x
        )
      );
    }
  };

  const toggleBookmark = async (id) => {
    setPosts((p) =>
      p.map((x) => (x.id === id ? { ...x, is_bookmarked: !x.is_bookmarked } : x))
    );
    try {
      await api(`/api/uploads/${id}/bookmark`, { method: "POST" });
    } catch {
      setPosts((p) =>
        p.map((x) => (x.id === id ? { ...x, is_bookmarked: !x.is_bookmarked } : x))
      );
    }
  };

  const logout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100">
      {/* ── Post Detail Modal ── */}
      {selectedPost && (
        <PostDetail
          postId={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={toggleLike}
          onBookmark={toggleBookmark}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-800 flex items-center justify-center font-bold text-white text-sm">
              E
            </div>
            <span className="text-lg font-bold tracking-tight">EmptyArt</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/upload")}
              className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-[#1a1a1a] transition"
              title="New post"
            >
              <IcPlus />
            </button>
          </div>
        </div>

        {/* ── Feed ── */}
        {loading && posts.length === 0 ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#1e1e1e] overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#252525]" />
                  <div className="flex-1">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-[#252525] rounded mb-2" />
                    <div className="h-2 w-16 bg-gray-200 dark:bg-[#252525] rounded" />
                  </div>
                </div>
                <div className="h-80 bg-gray-200 dark:bg-[#1a1a1a]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-32 bg-gray-200 dark:bg-[#252525] rounded" />
                  <div className="h-3 w-48 bg-gray-200 dark:bg-[#252525] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 dark:text-gray-500 text-lg mb-2">Your feed is empty</p>
            <p className="text-gray-400 dark:text-gray-600 text-sm mb-6">
              Follow other artists or upload your first artwork!
            </p>
            <button
              onClick={() => navigate("/explore")}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Explore artworks
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#1e1e1e] overflow-hidden"
              >
                {/* Author */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={() => navigate(`/profile/${post.author.id}`)}
                >
                  {post.author.avatar_url ? (
                    <img
                      src={imageUrl(post.author.avatar_url)}
                      className="w-10 h-10 rounded-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {post.author.username[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">{post.author.username}</p>
                    <p className="text-xs text-gray-400">{timeAgo(post.created_at)}</p>
                  </div>
                </div>

                {/* Image */}
                <img
                  src={imageUrl(post.image_url)}
                  alt={post.title}
                  className="w-full max-h-[600px] object-cover cursor-pointer"
                  onDoubleClick={() => toggleLike(post.id)}
                  onClick={() => setSelectedPost(post.id)}
                  loading="lazy"
                />

                {/* Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleLike(post.id)} className="hover:scale-110 transition">
                        <IcHeart s={post.is_liked} />
                      </button>
                      <button onClick={() => setSelectedPost(post.id)} className="hover:scale-110 transition">
                        <IcComment />
                      </button>
                    </div>
                    <button onClick={() => toggleBookmark(post.id)} className="hover:scale-110 transition">
                      <IcBookmark s={post.is_bookmarked} />
                    </button>
                  </div>

                  {post.like_count > 0 && (
                    <p className="text-sm font-semibold mb-1">
                      {post.like_count} {post.like_count === 1 ? "like" : "likes"}
                    </p>
                  )}

                  {post.title && (
                    <p className="text-sm">
                      <span className="font-semibold mr-1.5">{post.author.username}</span>
                      {post.title}
                    </p>
                  )}

                  {post.comment_count > 0 && (
                    <button
                      onClick={() => setSelectedPost(post.id)}
                      className="text-sm text-gray-400 mt-1 hover:text-gray-500 transition"
                    >
                      View {post.comment_count === 1 ? "1 comment" : `all ${post.comment_count} comments`}
                    </button>
                  )}
                </div>
              </article>
            ))}

            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="w-full py-3 text-sm text-primary font-semibold hover:bg-gray-100 dark:hover:bg-[#141414] rounded-xl transition"
              >
                {loading ? "Loading..." : "Load more"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
