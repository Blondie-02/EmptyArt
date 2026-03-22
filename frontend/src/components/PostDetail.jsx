import { useState, useEffect, useRef } from "react";
import { api, imageUrl } from "../api";
import toast from "react-hot-toast";

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
const IcX = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function PostDetail({ postId, onClose, onLike, onBookmark }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    api(`/api/uploads/${postId}`).then(setPost).catch(() => toast.error("Failed to load post"));
    api(`/api/uploads/${postId}/comments`).then((d) => setComments(d.comments)).catch(() => {});
  }, [postId]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const data = await api(`/api/uploads/${postId}/comment`, {
        method: "POST",
        body: { content: newComment.trim() },
      });
      setComments((prev) => [data.comment, ...prev]);
      setPost((p) => p && { ...p, comment_count: (p.comment_count || 0) + 1 });
      setNewComment("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!post) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={onClose}>
        <div className="animate-pulse w-16 h-16 rounded-full border-4 border-gray-600 border-t-white" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-50"
      >
        <IcX />
      </button>

      <div
        className="bg-white dark:bg-[#141414] rounded-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="lg:flex-1 bg-black flex items-center justify-center min-h-[300px] lg:min-h-0">
          <img
            src={imageUrl(post.image_url)}
            alt={post.title}
            className="w-full h-full max-h-[50vh] lg:max-h-[90vh] object-contain"
          />
        </div>

        {/* Details */}
        <div className="lg:w-96 flex flex-col border-l border-gray-200 dark:border-[#1e1e1e]">
          {/* Author header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-[#1e1e1e]">
            {post.author?.avatar_url ? (
              <img src={imageUrl(post.author.avatar_url)} className="w-9 h-9 rounded-full object-cover" alt="" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {post.author?.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{post.author?.username}</p>
              <p className="text-xs text-gray-400">{timeAgo(post.created_at)}</p>
            </div>
          </div>

          {/* Caption + Comments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[40vh] lg:max-h-none">
            {post.title && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {post.author?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    <span className="font-semibold mr-1">{post.author?.username}</span>
                    {post.title}
                  </p>
                  {post.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{post.description}</p>
                  )}
                </div>
              </div>
            )}

            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#252525] flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-xs shrink-0">
                  {c.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    <span className="font-semibold mr-1">{c.username}</span>
                    {c.reaction_details}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(c.created_at)}</p>
                </div>
              </div>
            ))}

            {comments.length === 0 && !post.title && (
              <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">No comments yet</p>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 dark:border-[#1e1e1e] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button onClick={() => onLike?.(post.id)} className="hover:scale-110 transition">
                  <IcHeart s={post.is_liked} />
                </button>
                <button onClick={() => inputRef.current?.focus()} className="hover:scale-110 transition">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
              <button onClick={() => onBookmark?.(post.id)} className="hover:scale-110 transition">
                <IcBookmark s={post.is_bookmarked} />
              </button>
            </div>

            {post.like_count > 0 && (
              <p className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                {post.like_count} {post.like_count === 1 ? "like" : "likes"}
              </p>
            )}

            {/* Comment input */}
            <form onSubmit={submitComment} className="flex gap-2">
              <input
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="text-primary font-semibold text-sm disabled:opacity-40 hover:opacity-80 transition"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
