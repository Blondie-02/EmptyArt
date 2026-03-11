import React, { useState, useRef } from "react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadMode, setUploadMode] = useState("url"); // "url" or "file"
  const [message, setMessage] = useState({ text: "", type: "" });
  const [posts, setPosts] = useState([
    { id: 1, title: "Getting Started with React", content: "React is a JavaScript library...", image_url: "", createdAt: "2025-03-01" },
    { id: 2, title: "Advanced Tailwind Tips", content: "Here are some advanced tips...", image_url: "", createdAt: "2025-03-05" },
  ]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showMessage("Please select a valid image file.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageUrl(reader.result); // In real app, upload to S3 etc.
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImagePreview(e.target.value);
  };

  const clearImage = () => {
    setImageUrl("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      showMessage("Title and content are required.", "error");
      return;
    }
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) { showMessage("You must be logged in as admin.", "error"); setIsLoading(false); return; }

    try {
      const res = await fetch("http://localhost:5000/api/admin/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ title, content, image_url: imageUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => [{ id: Date.now(), title, content, image_url: imageUrl, createdAt: new Date().toISOString().split("T")[0] }, ...prev]);
        showMessage("Post published successfully!");
        setTitle(""); setContent(""); clearImage();
        setActiveTab("manage");
      } else {
        showMessage(data.message || "Error creating post.", "error");
      }
    } catch {
      // Demo mode — add locally
      setPosts(prev => [{ id: Date.now(), title, content, image_url: imageUrl, createdAt: new Date().toISOString().split("T")[0] }, ...prev]);
      showMessage("Post published! (demo mode)");
      setTitle(""); setContent(""); clearImage();
      setActiveTab("manage");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/admin/delete-post/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
    } catch { /* demo mode */ }
    setPosts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    showMessage("Post deleted.");
  };

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
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", background: "#0f0f0f", color: "#e8e0d4" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #2a2a2a", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f0f0f" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 10, height: 10, background: "#c9a84c", borderRadius: "50%" }} />
          <span style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888" }}>Admin Console</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["create", "manage"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "8px 20px", border: "1px solid",
              borderColor: activeTab === tab ? "#c9a84c" : "#2a2a2a",
              background: activeTab === tab ? "#c9a84c" : "transparent",
              color: activeTab === tab ? "#0f0f0f" : "#888",
              cursor: "pointer", borderRadius: 4, fontSize: 12,
              letterSpacing: "0.15em", textTransform: "uppercase",
              fontFamily: "inherit", transition: "all 0.2s",
            }}>
              {tab === "create" ? "✍ Write" : `📋 Posts (${posts.length})`}
            </button>
          ))}
        </div>
      </header>

      {/* Toast */}
      {message.text && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 999,
          padding: "12px 20px", borderRadius: 6,
          background: message.type === "error" ? "#3d1a1a" : "#1a3d2a",
          border: `1px solid ${message.type === "error" ? "#8b3333" : "#2d7a50"}`,
          color: message.type === "error" ? "#ff8080" : "#80e0a0",
          fontSize: 13, maxWidth: 320,
        }}>
          {message.text}
        </div>
      )}

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px" }}>

        {/* CREATE TAB */}
        {activeTab === "create" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <label style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#666", display: "block", marginBottom: 8 }}>Post Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a compelling title..."
                style={{ width: "100%", padding: "14px 16px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, color: "#e8e0d4", fontSize: 22, fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* Image Upload */}
            <div>
              <label style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#666", display: "block", marginBottom: 8 }}>Cover Image</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {["file", "url"].map(mode => (
                  <button key={mode} onClick={() => { setUploadMode(mode); clearImage(); }} style={{
                    padding: "6px 16px", border: "1px solid",
                    borderColor: uploadMode === mode ? "#c9a84c" : "#2a2a2a",
                    background: "transparent", color: uploadMode === mode ? "#c9a84c" : "#666",
                    cursor: "pointer", borderRadius: 4, fontSize: 11,
                    letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "inherit",
                  }}>
                    {mode === "file" ? "📁 Upload File" : "🔗 Image URL"}
                  </button>
                ))}
              </div>

              {uploadMode === "file" ? (
                <div onClick={() => fileInputRef.current?.click()} style={{
                  border: "2px dashed #2a2a2a", borderRadius: 8, padding: "30px",
                  textAlign: "center", cursor: "pointer", background: "#141414",
                  transition: "border-color 0.2s",
                }}>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🖼</div>
                  <p style={{ color: "#666", fontSize: 13 }}>Click to upload or drag an image here</p>
                  <p style={{ color: "#444", fontSize: 11, marginTop: 4 }}>PNG, JPG, GIF, WEBP supported</p>
                </div>
              ) : (
                <input value={imageUrl} onChange={handleImageUrlChange} placeholder="https://example.com/image.jpg"
                  style={{ width: "100%", padding: "12px 16px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, color: "#e8e0d4", fontSize: 14, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }} />
              )}

              {imagePreview && (
                <div style={{ marginTop: 12, position: "relative", display: "inline-block" }}>
                  <img src={imagePreview} alt="Preview" style={{ maxHeight: 200, maxWidth: "100%", borderRadius: 6, border: "1px solid #2a2a2a", display: "block" }} onError={() => setImagePreview(null)} />
                  <button onClick={clearImage} style={{
                    position: "absolute", top: 6, right: 6, background: "#0f0f0fcc", border: "1px solid #444",
                    color: "#e8e0d4", borderRadius: "50%", width: 26, height: 26, cursor: "pointer", fontSize: 14, lineHeight: 1,
                  }}>×</button>
                </div>
              )}
            </div>

            {/* Content Editor */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#666" }}>Content</label>
                <div style={{ display: "flex", gap: 4 }}>
                  {[
                    { id: "bold", label: "B", title: "Bold" },
                    { id: "italic", label: "I", title: "Italic" },
                    { id: "heading", label: "H2", title: "Heading" },
                    { id: "quote", label: "❝", title: "Quote" },
                    { id: "list", label: "☰", title: "List" },
                    { id: "link", label: "⛓", title: "Link" },
                  ].map(btn => (
                    <button key={btn.id} onClick={() => insertFormat(btn.id)} title={btn.title} style={{
                      width: 30, height: 28, border: "1px solid #2a2a2a", background: "#1a1a1a",
                      color: "#888", cursor: "pointer", borderRadius: 4, fontSize: btn.id === "bold" ? 13 : 12,
                      fontWeight: btn.id === "bold" ? "bold" : "normal",
                      fontStyle: btn.id === "italic" ? "italic" : "normal",
                    }}>{btn.label}</button>
                  ))}
                </div>
              </div>
              <textarea id="blog-content" value={content} onChange={e => setContent(e.target.value)}
                placeholder="Write your blog post here... Supports **bold**, _italic_, ## headings, > quotes, - lists, and [links](url)"
                style={{ width: "100%", minHeight: 320, padding: "16px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, color: "#e8e0d4", fontSize: 15, fontFamily: "Georgia, serif", lineHeight: 1.8, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: "#444" }}>{content.length} characters · ~{Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min read</span>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={isLoading} style={{
              padding: "14px 32px", background: isLoading ? "#444" : "#c9a84c",
              border: "none", borderRadius: 6, color: "#0f0f0f",
              fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase",
              fontFamily: "inherit", fontWeight: "bold", cursor: isLoading ? "not-allowed" : "pointer",
              alignSelf: "flex-start", transition: "background 0.2s",
            }}>
              {isLoading ? "Publishing..." : "Publish Post →"}
            </button>
          </div>
        )}

        {/* MANAGE TAB */}
        {activeTab === "manage" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", color: "#666", margin: 0 }}>All Posts</h2>
              <span style={{ fontSize: 12, color: "#444" }}>{posts.length} total</span>
            </div>

            {posts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#444" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
                <p>No posts yet. Start writing!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {posts.map(post => (
                  <div key={post.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 20px", background: "#141414", borderRadius: 6,
                    border: "1px solid #1e1e1e", gap: 16,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                      {post.image_url ? (
                        <img src={post.image_url} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} onError={e => e.target.style.display = "none"} />
                      ) : (
                        <div style={{ width: 48, height: 48, background: "#1e1e1e", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#444", fontSize: 20 }}>📄</div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 15, color: "#e8e0d4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</div>
                        <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>{post.createdAt} · {post.content.split(/\s+/).length} words</div>
                      </div>
                    </div>

                    {deleteConfirm === post.id ? (
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 12, color: "#888" }}>Delete?</span>
                        <button onClick={() => handleDelete(post.id)} style={{ padding: "6px 14px", background: "#8b3333", border: "none", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Yes</button>
                        <button onClick={() => setDeleteConfirm(null)} style={{ padding: "6px 14px", background: "#2a2a2a", border: "none", color: "#888", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(post.id)} style={{
                        padding: "6px 14px", background: "transparent",
                        border: "1px solid #2a2a2a", color: "#666",
                        borderRadius: 4, cursor: "pointer", fontSize: 12,
                        fontFamily: "inherit", flexShrink: 0,
                        transition: "all 0.15s",
                      }}
                        onMouseEnter={e => { e.target.style.borderColor = "#8b3333"; e.target.style.color = "#e07070"; }}
                        onMouseLeave={e => { e.target.style.borderColor = "#2a2a2a"; e.target.style.color = "#666"; }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;