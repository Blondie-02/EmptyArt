import { useState, useEffect } from "react";
import { api, imageUrl } from "../api";
import PostDetail from "./PostDetail";

export default function Bookmarks() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    api("/api/uploads/bookmarked")
      .then((data) => setPosts(data.posts))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleLike = async (id) => {
    setPosts((p) =>
      p.map((x) =>
        x.id === id ? { ...x, is_liked: !x.is_liked, like_count: x.is_liked ? x.like_count - 1 : x.like_count + 1 } : x
      )
    );
    try { await api(`/api/uploads/${id}/like`, { method: "POST" }); } catch {}
  };

  const toggleBookmark = async (id) => {
    setPosts((p) => p.map((x) => (x.id === id ? { ...x, is_bookmarked: !x.is_bookmarked } : x)));
    try { await api(`/api/uploads/${id}/bookmark`, { method: "POST" }); } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-4">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-1 sm:gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 dark:bg-[#1a1a1a] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100">
      {selectedPost && (
        <PostDetail
          postId={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={toggleLike}
          onBookmark={toggleBookmark}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-6">Saved</h1>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Save artworks you love to see them here.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post.id)}
                className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
              >
                <img
                  src={imageUrl(post.image_url)}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-4 text-white font-semibold text-sm">
                    <span className="flex items-center gap-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {post.like_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      {post.comment_count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
