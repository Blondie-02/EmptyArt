import React, { useState, useEffect, useRef } from "react";


const CommentManagement = ({ comments, onDelete }) => (
  <div>
    {comments.map(c => (
      <div key={c.id} style={{ marginBottom: 8, borderBottom: "1px solid #333", padding: 6 }}>
        <strong>{c.user_name}</strong> on <em>{c.post_title}</em>: {c.content}
        <button onClick={() => onDelete(c.id)} style={{ marginLeft: 10 }}>Delete</button>
      </div>
    ))}
  </div>
);

const LikeManagement = ({ likes, onDelete }) => (
  <div>
    {likes.map(l => (
      <div key={l.id} style={{ marginBottom: 8, borderBottom: "1px solid #333", padding: 6 }}>
        {l.user_name} liked <em>{l.post_title}</em>
        <button onClick={() => onDelete(l.id)} style={{ marginLeft: 10 }}>Delete</button>
      </div>
    ))}
  </div>
);

const MessageManagement = ({ messages, onDelete }) => (
  <div>
    {messages.map(m => (
      <div key={m.id} style={{ marginBottom: 8, borderBottom: "1px solid #333", padding: 6 }}>
        <strong>{m.sender_name}</strong> → <strong>{m.receiver_name}</strong>: {m.content}
        <button onClick={() => onDelete(m.id)} style={{ marginLeft: 10 }}>Delete</button>
      </div>
    ))}
  </div>
);

const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  // --- Tabs ---
  const tabs = ["create", "posts", "comments", "likes", "messages"];
  const [activeTab, setActiveTab] = useState("create");

  // --- Post creation ---
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // --- Post management ---
  const [posts, setPosts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // --- Other admin tabs ---
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [messages, setMessages] = useState([]);

  // --- Toast message helper ---
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  // --- Image upload preview ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return showMessage("Please select an image.", "error");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Fetch posts & other tab data ---
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        if (activeTab === "posts" || activeTab === "create") {
          const res = await fetch("http://localhost:5000/api/posts");
          const data = await res.json();
          if (data.success) setPosts(data.posts);
        }
        if (activeTab === "comments") {
          const res = await fetch("http://localhost:5000/api/admin/comments", { headers: { Authorization: "Bearer " + token } });
          const data = await res.json();
          if (data.success) setComments(data.comments);
        }
        if (activeTab === "likes") {
          const res = await fetch("http://localhost:5000/api/admin/likes", { headers: { Authorization: "Bearer " + token } });
          const data = await res.json();
          if (data.success) setLikes(data.likes);
        }
        if (activeTab === "messages") {
          const res = await fetch("http://localhost:5000/api/admin/messages", { headers: { Authorization: "Bearer " + token } });
          const data = await res.json();
          if (data.success) setMessages(data.messages);
        }
      } catch (err) { console.error(err); }
    };

    fetchData();
  }, [activeTab, token]);

  // --- CRUD Handlers ---
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return showMessage("Title and content required.", "error");
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("http://localhost:5000/api/admin/create-post", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        showMessage("Post created!");
        setTitle(""); setContent(""); clearImage();
        setActiveTab("posts");
      } else showMessage(data.message || "Error creating post.", "error");
    } catch (err) {
      console.error(err);
      showMessage("Error creating post.", "error");
    }
    setIsLoading(false);
  };

  const handleDelete = async (type, id) => {
    if (!token) return;
    try {
      const urlMap = {
        posts: `/api/admin/delete-post/${id}`,
        comments: `/api/admin/comments/${id}`,
        likes: `/api/admin/likes/${id}`,
        messages: `/api/admin/messages/${id}`
      };
      const res = await fetch("http://localhost:5000" + urlMap[type], {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
      });
      const data = await res.json();
      if (!data.success) return showMessage("Failed to delete.", "error");

      // Remove from state
      if (type === "posts") setPosts(posts.filter(p => p.id !== id));
      if (type === "comments") setComments(comments.filter(c => c.id !== id));
      if (type === "likes") setLikes(likes.filter(l => l.id !== id));
      if (type === "messages") setMessages(messages.filter(m => m.id !== id));
      showMessage(`${type.slice(0, -1)} deleted.`);
    } catch (err) { console.error(err); showMessage("Failed to delete.", "error"); }
    setDeleteConfirm(null);
  };

  // --- Formatting buttons ---
  const insertFormat = (tag) => {
    const textarea = document.getElementById("blog-content");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const formats = {
      bold: `**${selected || "bold text"}**`,
      italic: `_${selected || "italic text"}_`,
      heading: `\n## ${selected || "Heading"}\n`,
      quote: `\n> ${selected || "Quote here"}\n`,
      link: `[${selected || "link text"}](url)`,
      list: `\n- ${selected || "List item"}\n`,
    };
    const newContent = content.substring(0, start) + formats[tag] + content.substring(end);
    setContent(newContent);
    setTimeout(() => textarea.focus(), 10);
  };

  return (
    <div style={{ fontFamily: "Georgia, serif", padding: 20, color: "#e8e0d4", background: "#0f0f0f", minHeight: "100vh" }}>
      <h2>Admin Dashboard</h2>

      {/* Toast */}
      {message.text && (
        <div style={{ position: "fixed", top: 20, right: 20, background: message.type === "error" ? "#3d1a1a" : "#1a3d2a", color: "#fff", padding: 12, borderRadius: 6 }}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: 8,
              background: activeTab === tab ? "#c9a84c" : "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: activeTab === tab ? "#0f0f0f" : "#888",
              cursor: "pointer"
            }}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CREATE TAB */}
      {activeTab === "create" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input placeholder="Title..." value={title} onChange={e => setTitle(e.target.value)} style={{ padding: 10, fontSize: 18 }} />

          {/* Formatting buttons */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["bold","italic","heading","quote","link","list"].map(f => (
              <button key={f} onClick={() => insertFormat(f)} style={{ padding: 6, background: "#2a2a2a", color: "#e8e0d4", border: "1px solid #444", cursor: "pointer" }}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <textarea id="blog-content" placeholder="Content..." value={content} onChange={e => setContent(e.target.value)} style={{ padding: 10, minHeight: 200 }} />
          
          <div onClick={() => fileInputRef.current?.click()} style={{ border: "2px dashed #2a2a2a", padding: 20, textAlign: "center", cursor: "pointer" }}>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            {imagePreview ? <img src={imagePreview} alt="" style={{ maxHeight: 150 }} /> : "Click to upload image"}
          </div>

          <button onClick={handleSubmit} disabled={isLoading} style={{ padding: 10, background: "#c9a84c", color: "#0f0f0f" }}>
            {isLoading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      )}

      {/* POSTS TAB */}
      {activeTab === "posts" && (
        <div>
          {posts.length === 0 ? <p>No posts yet.</p> :
            posts.map(p => (
              <div key={p.id} style={{ padding: 10, borderBottom: "1px solid #333" }}>
                {p.title} 
                <button onClick={() => handleDelete("posts", p.id)} style={{ marginLeft: 10 }}>Delete</button>
              </div>
            ))}
        </div>
      )}

      {activeTab === "comments" && <CommentManagement comments={comments} onDelete={id => handleDelete("comments", id)} />}
      {activeTab === "likes" && <LikeManagement likes={likes} onDelete={id => handleDelete("likes", id)} />}
      {activeTab === "messages" && <MessageManagement messages={messages} onDelete={id => handleDelete("messages", id)} />}
    </div>
  );
};

export default AdminDashboard;