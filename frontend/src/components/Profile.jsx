import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, imageUrl } from "../api";
import PostDetail from "./PostDetail";
import toast from "react-hot-toast";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    api("/api/auth/me").then((d) => setMe(d.user)).catch(() => {});
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const [profileData, uploadsData] = await Promise.all([
        api(`/api/users/${userId}`),
        api(`/api/uploads/user/${userId}`),
      ]);
      setProfile(profileData);
      setPosts(uploadsData.posts);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const toggleFollow = async () => {
    if (!profile) return;
    const wasFollowing = profile.is_following;
    setProfile((p) => ({
      ...p,
      is_following: !wasFollowing,
      followers: wasFollowing ? p.followers - 1 : p.followers + 1,
    }));
    try {
      await api(`/api/users/${userId}/follow`, { method: "POST" });
    } catch {
      setProfile((p) => ({
        ...p,
        is_following: wasFollowing,
        followers: wasFollowing ? p.followers : p.followers - 1,
      }));
    }
  };

  const saveProfile = async () => {
    const fd = new FormData();
    fd.append("bio", editBio);
    fd.append("username", editUsername);
    if (avatarFile) fd.append("avatar", avatarFile);

    try {
      const data = await api(`/api/users/${userId}`, { method: "PUT", body: fd, isFormData: true });
      setProfile((p) => ({ ...p, ...data.user }));
      setEditMode(false);
      setAvatarFile(null);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

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

  const isOwnProfile = me && profile && me.id === profile.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center text-gray-500">
        User not found
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

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition mb-6"
        >
          ← Back
        </button>

        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
          {/* Avatar */}
          <div className="relative">
            {profile.avatar_url ? (
              <img
                src={imageUrl(profile.avatar_url)}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-[#1e1e1e]"
                alt=""
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-white dark:border-[#1e1e1e]">
                {profile.username[0]?.toUpperCase()}
              </div>
            )}
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer hover:opacity-90">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                />
              </label>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
              {editMode ? (
                <input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="input-field max-w-xs"
                />
              ) : (
                <h1 className="text-xl font-bold">{profile.username}</h1>
              )}

              {isOwnProfile ? (
                editMode ? (
                  <div className="flex gap-2">
                    <button onClick={saveProfile} className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition">
                      Save
                    </button>
                    <button onClick={() => setEditMode(false)} className="px-4 py-1.5 border border-gray-300 dark:border-[#282828] rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setEditBio(profile.bio || "");
                      setEditUsername(profile.username);
                    }}
                    className="px-4 py-1.5 border border-gray-300 dark:border-[#282828] rounded-lg text-sm font-semibold hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition"
                  >
                    Edit profile
                  </button>
                )
              ) : (
                <button
                  onClick={toggleFollow}
                  className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition ${
                    profile.is_following
                      ? "border border-gray-300 dark:border-[#282828] hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                      : "bg-primary text-white hover:opacity-90"
                  }`}
                >
                  {profile.is_following ? "Following" : "Follow"}
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center sm:justify-start gap-6 mb-4">
              <div className="text-center">
                <span className="font-bold">{profile.upload_count || 0}</span>
                <span className="text-gray-500 ml-1 text-sm">posts</span>
              </div>
              <div className="text-center">
                <span className="font-bold">{profile.followers || 0}</span>
                <span className="text-gray-500 ml-1 text-sm">followers</span>
              </div>
              <div className="text-center">
                <span className="font-bold">{profile.following || 0}</span>
                <span className="text-gray-500 ml-1 text-sm">following</span>
              </div>
            </div>

            {/* Bio */}
            {editMode ? (
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                className="input-field resize-none w-full"
              />
            ) : (
              profile.bio && <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Uploads grid */}
        <div className="border-t border-gray-200 dark:border-[#1e1e1e] pt-6">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto mb-4 text-gray-300 dark:text-gray-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-gray-400 dark:text-gray-500">
                {isOwnProfile ? "Share your first artwork!" : "No posts yet"}
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate("/upload")}
                  className="mt-4 bg-primary text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition"
                >
                  Upload
                </button>
              )}
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
    </div>
  );
}
