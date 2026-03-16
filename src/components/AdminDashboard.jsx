import React, { useState, useEffect, useRef } from "react";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ic = {
  Create:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  Posts:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  Comments: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Likes:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Messages: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Trash:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Image:    () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Bold:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>,
  Italic:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
  Quote:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>,
  Link:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  List:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  X:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Logout:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Menu:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
};

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const rs = {
  rowUser:    { fontSize:13, fontWeight:600, color:"#e8e0d4" },
  rowPost:    { fontSize:13, color:"#131365" },
  rowMeta:    { fontSize:13, color:"#555" },
  rowContent: { fontSize:13, color:"#666", margin:"4px 0 0", lineHeight:1.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:520 },
  iconBtn:    { background:"none", border:"1px solid #2a2a2a", borderRadius:6, padding:"5px 7px", cursor:"pointer", color:"#555", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" },
};

// ─── ROW WRAPPER ─────────────────────────────────────────────────────────────
const Row = ({ children, onDelete, confirmId, rowId, onConfirm, onCancel }) => {
  const confirming = confirmId === rowId;
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"14px 18px", borderBottom:"1px solid #161616", gap:12, transition:"background .15s" }}
      onMouseEnter={e => e.currentTarget.style.background="#111"}
      onMouseLeave={e => e.currentTarget.style.background="transparent"}
    >
      <div style={{ flex:1, minWidth:0 }}>{children}</div>
      <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0, marginTop:2 }}>
        {confirming ? (
          <>
            <span style={{ fontSize:12, color:"#666" }}>Delete?</span>
            <button onClick={onConfirm} style={{ ...rs.iconBtn, color:"#f87171", borderColor:"#3d1a1a" }}><Ic.Check /></button>
            <button onClick={onCancel}  style={rs.iconBtn}><Ic.X /></button>
          </>
        ) : (
          <button onClick={onDelete}
            style={rs.iconBtn}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#3d1a1a"; e.currentTarget.style.color="#f87171"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#2a2a2a"; e.currentTarget.style.color="#555"; }}
          ><Ic.Trash /></button>
        )}
      </div>
    </div>
  );
};

const Empty = ({ label }) => (
  <div style={{ textAlign:"center", padding:"60px 0", color:"#333", fontSize:13, letterSpacing:".06em", textTransform:"uppercase" }}>{label}</div>
);

// ─── TAB COMPONENTS ───────────────────────────────────────────────────────────
const CommentTab = ({ comments, onDelete, confirmId, setConfirmId }) => (
  <div>
    {comments.length === 0 && <Empty label="No comments" />}
    {comments.map(c => (
      <Row key={c.id} rowId={`c-${c.id}`} confirmId={confirmId} setConfirmId={setConfirmId}
        onDelete={() => setConfirmId(`c-${c.id}`)} onConfirm={() => onDelete(c.id)} onCancel={() => setConfirmId(null)}>
        <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
          <span style={rs.rowUser}>{c.user_name}</span>
          <span style={rs.rowMeta}>on</span>
          <span style={rs.rowPost}>{c.post_title}</span>
        </div>
        <p style={rs.rowContent}>{c.content}</p>
      </Row>
    ))}
  </div>
);

const LikesTab = ({ likes, onDelete, confirmId, setConfirmId }) => (
  <div>
    {likes.length === 0 && <Empty label="No likes" />}
    {likes.map(l => (
      <Row key={l.id} rowId={`l-${l.id}`} confirmId={confirmId} setConfirmId={setConfirmId}
        onDelete={() => setConfirmId(`l-${l.id}`)} onConfirm={() => onDelete(l.id)} onCancel={() => setConfirmId(null)}>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          <span style={rs.rowUser}>{l.user_name}</span>
          <span style={{ color:"#5044e5", fontSize:12 }}>♥</span>
          <span style={rs.rowMeta}>liked</span>
          <span style={rs.rowPost}>{l.post_title}</span>
        </div>
      </Row>
    ))}
  </div>
);

const MessagesTab = ({ messages, onDelete, confirmId, setConfirmId }) => (
  <div>
    {messages.length === 0 && <Empty label="No messages" />}
    {messages.map(m => (
      <Row key={m.id} rowId={`m-${m.id}`} confirmId={confirmId} setConfirmId={setConfirmId}
        onDelete={() => setConfirmId(`m-${m.id}`)} onConfirm={() => onDelete(m.id)} onCancel={() => setConfirmId(null)}>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          <span style={rs.rowUser}>{m.sender_name}</span>
          <span style={{ color:"#444", fontSize:12 }}>→</span>
          <span style={rs.rowUser}>{m.receiver_name}</span>
        </div>
        <p style={rs.rowContent}>{m.content}</p>
      </Row>
    ))}
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  const TABS = [
    { key:"create",   label:"Create Post", Icon: Ic.Create   },
    { key:"posts",    label:"Posts",       Icon: Ic.Posts    },
    { key:"comments", label:"Comments",    Icon: Ic.Comments },
    { key:"likes",    label:"Likes",       Icon: Ic.Likes    },
    { key:"messages", label:"Messages",    Icon: Ic.Messages },
  ];

  const [activeTab, setActiveTab]       = useState("create");
  const [title, setTitle]               = useState("");
  const [content, setContent]           = useState("");
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef                    = useRef(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [toast, setToast]               = useState({ text:"", type:"" });
  const [posts, setPosts]               = useState([]);
  const [comments, setComments]         = useState([]);
  const [likes, setLikes]               = useState([]);
  const [messages, setMessages]         = useState([]);
  const [confirmId, setConfirmId]       = useState(null);
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  const showToast = (text, type="success") => {
    setToast({ text, type });
    setTimeout(() => setToast({ text:"", type:"" }), 3500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return showToast("Please select an image file.", "error");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (!token) return;
    const go = async () => {
      try {
        if (activeTab === "posts" || activeTab === "create") {
          const r = await fetch("http://localhost:5000/api/posts");
          const d = await r.json();
          if (d.success) setPosts(d.posts);
        }
        if (activeTab === "comments") {
          const r = await fetch("http://localhost:5000/api/admin/comments", { headers:{ Authorization:"Bearer "+token } });
          const d = await r.json();
          if (d.success) setComments(d.comments);
        }
        if (activeTab === "likes") {
          const r = await fetch("http://localhost:5000/api/admin/likes", { headers:{ Authorization:"Bearer "+token } });
          const d = await r.json();
          if (d.success) setLikes(d.likes);
        }
        if (activeTab === "messages") {
          const r = await fetch("http://localhost:5000/api/admin/messages", { headers:{ Authorization:"Bearer "+token } });
          const d = await r.json();
          if (d.success) setMessages(d.messages);
        }
      } catch(e) { console.error(e); }
    };
    go();
  }, [activeTab, token]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return showToast("Title and content are required.", "error");
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("content", content);
      if (imageFile) fd.append("image", imageFile);
      const r = await fetch("http://localhost:5000/api/admin/create-post", {
        method:"POST", headers:{ Authorization:"Bearer "+token }, body:fd
      });
      const d = await r.json();
      if (d.success) {
        setPosts([d.post, ...posts]);
        showToast("Post published successfully.");
        setTitle(""); setContent(""); clearImage();
        setActiveTab("posts");
      } else showToast(d.message || "Failed to create post.", "error");
    } catch(e) { showToast("Failed to create post.", "error"); }
    setIsLoading(false);
  };

  const handleDelete = async (type, id) => {
    const urlMap = {
      posts:    `/api/admin/delete-post/${id}`,
      comments: `/api/admin/comments/${id}`,
      likes:    `/api/admin/likes/${id}`,
      messages: `/api/admin/messages/${id}`,
    };
    try {
      const r = await fetch("http://localhost:5000" + urlMap[type], {
        method:"DELETE", headers:{ Authorization:"Bearer "+token }
      });
      const d = await r.json();
      if (!d.success) return showToast("Failed to delete.", "error");
      if (type==="posts")    setPosts(p    => p.filter(x => x.id!==id));
      if (type==="comments") setComments(p => p.filter(x => x.id!==id));
      if (type==="likes")    setLikes(p    => p.filter(x => x.id!==id));
      if (type==="messages") setMessages(p => p.filter(x => x.id!==id));
      const label = type.slice(0,-1);
      showToast(`${label.charAt(0).toUpperCase()+label.slice(1)} deleted.`);
    } catch(e) { showToast("Failed to delete.", "error"); }
    setConfirmId(null);
  };

  const insertFormat = (tag) => {
    const el = document.getElementById("adm-body");
    if (!el) return;
    const a = el.selectionStart, b = el.selectionEnd;
    const sel = content.substring(a, b);
    const map = {
      bold:    `**${sel||"bold text"}**`,
      italic:  `_${sel||"italic text"}_`,
      heading: `\n## ${sel||"Heading"}\n`,
      quote:   `\n> ${sel||"Quote"}\n`,
      link:    `[${sel||"link text"}](url)`,
      list:    `\n- ${sel||"List item"}\n`,
    };
    setContent(content.substring(0,a) + map[tag] + content.substring(b));
    setTimeout(() => el.focus(), 10);
  };

  const counts = { posts:posts.length, comments:comments.length, likes:likes.length, messages:messages.length };
  const currentTab = TABS.find(t => t.key===activeTab);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0a0a", fontFamily:"'DM Sans', sans-serif", color:"#e8e0d4" }}>
      <style>{`
      
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:#222;border-radius:4px;}
        textarea,input{font-family:'DM Sans',sans-serif;}
        .adm-in:focus{border-color:#5044e5 !important;outline:none;}
        .adm-nb:hover{background:#181818 !important;color:#e8e0d4 !important;}
        .adm-fb:hover{background:#2a2a2a !important;color:#e8e0d4 !important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-10px);}to{opacity:1;transform:translateX(0);}}
        @media(max-width:768px){
          .adm-side{transform:translateX(-100%);position:fixed !important;z-index:200;transition:transform .25s ease;}
          .adm-side.open{transform:translateX(0);}
          .adm-mob{display:flex !important;}
        }
        @media(min-width:769px){.adm-mob{display:none !important;}}
      `}</style>

      {/* ── SIDEBAR ──────────────────────────────────────────────────────────── */}
      <aside className={`adm-side${sidebarOpen?" open":""}`}
        style={{ width:236, background:"#0d0d0d", borderRight:"1px solid #181818", display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0, overflowY:"auto", flexShrink:0 }}>

        {/* Brand */}
        <div style={{ padding:"26px 22px 18px", borderBottom:"1px solid #181818" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#5044e5,#3a30c5)", display:"flex", alignItems:"center", justifyContent:"center", color:"#0a0a0a", fontWeight:800, fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontStyle:"italic" }}>E</div>
            <div>
              <p style={{ fontSize:14, fontWeight:700, color:"#e8e0d4", letterSpacing:".01em", margin:0 }}>EmptyArt</p>
              <p style={{ fontSize:10, color:"#444", letterSpacing:".1em", textTransform:"uppercase", margin:"2px 0 0" }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"14px 10px" }}>
          <p style={{ fontSize:10, color:"#2e2e2e", letterSpacing:".12em", textTransform:"uppercase", padding:"0 10px", marginBottom:8 }}>Manage</p>
          {TABS.map(({ key, label, Icon }) => {
            const active = activeTab===key;
            return (
              <button key={key} className="adm-nb"
                onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
                style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 12px", borderRadius:10, border:"none", cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif", textAlign:"left", marginBottom:2, transition:"all .15s",
                  background: active ? "#181818" : "transparent",
                  color:      active ? "#5044e5" : "#555",
                  borderLeft: active ? "2px solid #5044e5" : "2px solid transparent",
                }}>
                <Icon />
                <span style={{ flex:1 }}>{label}</span>
                {counts[key] > 0 && (
                  <span style={{ fontSize:10, padding:"1px 7px", borderRadius:99, fontWeight:600,
                    background: active ? "rgba(80,68,229,.15)" : "#181818",
                    color:      active ? "#5044e5" : "#444",
                  }}>{counts[key]}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding:"14px 18px", borderTop:"1px solid #181818" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", color:"#5044e5", fontWeight:700, fontSize:13, fontFamily:"'Cormorant Garamond',serif" }}>A</div>
            <div>
              <p style={{ fontSize:13, fontWeight:600, color:"#e8e0d4", margin:0 }}>Admin</p>
              <p style={{ fontSize:11, color:"#3a3a3a", margin:0 }}>Super User</p>
            </div>
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.href="/"; }}
            style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"1px solid #1e1e1e", borderRadius:8, padding:"8px 12px", cursor:"pointer", color:"#555", fontSize:12, width:"100%", fontFamily:"'DM Sans',sans-serif", transition:"all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#3d1a1a"; e.currentTarget.style.color="#f87171"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#1e1e1e"; e.currentTarget.style.color="#555"; }}
          ><Ic.Logout /> Log out</button>
        </div>
      </aside>

      {/* Overlay backdrop */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:199 }} />
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

        {/* Mobile top bar */}
        <div className="adm-mob"
          style={{ display:"none", alignItems:"center", justifyContent:"space-between", padding:"12px 18px", background:"#0d0d0d", borderBottom:"1px solid #181818", position:"sticky", top:0, zIndex:50 }}>
          <button onClick={() => setSidebarOpen(v=>!v)}
            style={{ background:"none", border:"1px solid #252525", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"#777", display:"flex" }}>
            <Ic.Menu />
          </button>
          <span style={{ fontSize:14, fontWeight:600, color:"#e8e0d4" }}>{currentTab?.label}</span>
          <div style={{ width:36 }} />
        </div>

        {/* Page body */}
        <div style={{ flex:1, overflowY:"auto", padding:"clamp(20px,4vw,40px) clamp(18px,4vw,40px)", maxWidth:860 }}>

          {/* Page header */}
          <div style={{ marginBottom:28, animation:"fadeUp .35s ease" }}>
            <h1 style={{ fontSize:"clamp(1.3rem,3vw,1.8rem)", fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:"#e8e0d4", letterSpacing:"-.01em", margin:"0 0 8px" }}>
              {currentTab?.label}
            </h1>
            <div style={{ width:28, height:2, background:"linear-gradient(90deg,#5044e5,transparent)", borderRadius:2 }} />
          </div>

          {/* ── CREATE ─────────────────────────────────────────────────────── */}
          {activeTab === "create" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20, animation:"fadeUp .35s ease" }}>

              <div>
                <label style={{ fontSize:11, color:"#444", letterSpacing:".1em", textTransform:"uppercase", display:"block", marginBottom:8 }}>Post Title</label>
                <input className="adm-in" value={title} onChange={e=>setTitle(e.target.value)}
                  placeholder="Enter a compelling title..."
                  style={{ width:"100%", background:"#111", border:"1px solid #1e1e1e", borderRadius:10, padding:"13px 16px", fontSize:17, color:"#e8e0d4", fontFamily:"'Cormorant Garamond',serif", fontWeight:600, letterSpacing:"-.01em", transition:"border .2s" }} />
              </div>

              {/* Format toolbar */}
              <div>
                <label style={{ fontSize:11, color:"#444", letterSpacing:".1em", textTransform:"uppercase", display:"block", marginBottom:8 }}>Content</label>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:8 }}>
                  {[
                    { key:"bold",    Icon:Ic.Bold,   label:"Bold"   },
                    { key:"italic",  Icon:Ic.Italic, label:"Italic" },
                    { key:"heading", Icon:Ic.Quote,  label:"H2"     },
                    { key:"quote",   Icon:Ic.Quote,  label:"Quote"  },
                    { key:"link",    Icon:Ic.Link,   label:"Link"   },
                    { key:"list",    Icon:Ic.List,   label:"List"   },
                  ].map(({ key, Icon, label }) => (
                    <button key={key} className="adm-fb" onClick={() => insertFormat(key)}
                      style={{ background:"#161616", border:"1px solid #222", borderRadius:7, padding:"5px 10px", cursor:"pointer", color:"#666", display:"flex", alignItems:"center", gap:5, fontSize:11, fontFamily:"'DM Sans',sans-serif", transition:"all .15s" }}>
                      <Icon /><span style={{ fontSize:10, letterSpacing:".03em" }}>{label}</span>
                    </button>
                  ))}
                </div>
                <textarea id="adm-body" className="adm-in" value={content} onChange={e=>setContent(e.target.value)}
                  placeholder="Write your post content here. Markdown is supported..."
                  style={{ width:"100%", background:"#111", border:"1px solid #1e1e1e", borderRadius:10, padding:"14px 16px", fontSize:14, color:"#e8e0d4", lineHeight:1.8, minHeight:260, resize:"vertical", transition:"border .2s" }} />
              </div>

              {/* Image upload */}
              <div>
                <label style={{ fontSize:11, color:"#444", letterSpacing:".1em", textTransform:"uppercase", display:"block", marginBottom:8 }}>Cover Image</label>
                <div onClick={() => fileInputRef.current?.click()}
                  style={{ border:"1.5px dashed #222", borderRadius:12, padding:imagePreview?0:"40px 20px", textAlign:"center", cursor:"pointer", overflow:"hidden", position:"relative", transition:"border .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="#5044e5"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="#222"}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display:"none" }} />
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="" style={{ width:"100%", maxHeight:220, objectFit:"cover", display:"block" }} />
                      <button onClick={e=>{e.stopPropagation();clearImage();}}
                        style={{ position:"absolute", top:10, right:10, background:"rgba(0,0,0,.75)", border:"none", borderRadius:"50%", width:28, height:28, cursor:"pointer", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Ic.X />
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ color:"#2e2e2e", marginBottom:8, display:"flex", justifyContent:"center" }}><Ic.Image /></div>
                      <p style={{ fontSize:13, color:"#3a3a3a" }}>Click to upload cover image</p>
                      <p style={{ fontSize:11, color:"#272727", marginTop:4 }}>PNG · JPG · WEBP</p>
                    </>
                  )}
                </div>
              </div>

              <button onClick={handleSubmit} disabled={isLoading}
                style={{ alignSelf:"flex-start", background:isLoading?"#1a1a1a":"linear-gradient(135deg,#5044e5,#9a7228)", border:"none", borderRadius:10, padding:"12px 28px", fontSize:14, fontWeight:600, color:isLoading?"#555":"#0a0a0a", cursor:isLoading?"not-allowed":"pointer", fontFamily:"'DM Sans',sans-serif", letterSpacing:".02em", transition:"opacity .2s" }}>
                {isLoading ? "Publishing…" : "Publish Post →"}
              </button>
            </div>
          )}

          {/* ── POSTS ──────────────────────────────────────────────────────── */}
          {activeTab === "posts" && (
            <div style={{ animation:"fadeUp .35s ease" }}>
              {posts.length === 0 && <Empty label="No posts yet" />}
              {posts.map((p, i) => (
                <div key={p.id}
                  style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", borderBottom:"1px solid #161616", gap:12, transition:"background .15s", animation:`slideIn .3s ease ${i*.04}s both` }}
                  onMouseEnter={e=>e.currentTarget.style.background="#111"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:14, color:"#e8e0d4", fontWeight:500, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.title}</p>
                    {p.created_at && (
                      <p style={{ fontSize:11, color:"#3a3a3a", margin:"3px 0 0" }}>
                        {new Date(p.created_at).toLocaleDateString("en-US",{ year:"numeric", month:"short", day:"numeric" })}
                      </p>
                    )}
                  </div>
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    {confirmId===`p-${p.id}` ? (
                      <>
                        <span style={{ fontSize:12, color:"#666", alignSelf:"center" }}>Delete?</span>
                        <button onClick={()=>handleDelete("posts",p.id)} style={{ ...rs.iconBtn, color:"#f87171", borderColor:"#3d1a1a" }}><Ic.Check /></button>
                        <button onClick={()=>setConfirmId(null)} style={rs.iconBtn}><Ic.X /></button>
                      </>
                    ) : (
                      <button onClick={()=>setConfirmId(`p-${p.id}`)} style={rs.iconBtn}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor="#3d1a1a";e.currentTarget.style.color="#f87171";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="#2a2a2a";e.currentTarget.style.color="#555";}}
                      ><Ic.Trash /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── COMMENTS ───────────────────────────────────────────────────── */}
          {activeTab === "comments" && (
            <div style={{ animation:"fadeUp .35s ease" }}>
              <CommentTab comments={comments} onDelete={id=>handleDelete("comments",id)} confirmId={confirmId} setConfirmId={setConfirmId} />
            </div>
          )}

          {/* ── LIKES ──────────────────────────────────────────────────────── */}
          {activeTab === "likes" && (
            <div style={{ animation:"fadeUp .35s ease" }}>
              <LikesTab likes={likes} onDelete={id=>handleDelete("likes",id)} confirmId={confirmId} setConfirmId={setConfirmId} />
            </div>
          )}

          {/* ── MESSAGES ───────────────────────────────────────────────────── */}
          {activeTab === "messages" && (
            <div style={{ animation:"fadeUp .35s ease" }}>
              <MessagesTab messages={messages} onDelete={id=>handleDelete("messages",id)} confirmId={confirmId} setConfirmId={setConfirmId} />
            </div>
          )}
        </div>
      </div>

      {/* ── TOAST ────────────────────────────────────────────────────────────── */}
      {toast.text && (
        <div style={{
          position:"fixed", bottom:24, right:24, zIndex:9999,
          background: toast.type==="error" ? "#1a0808" : "#081a0e",
          border: `1px solid ${toast.type==="error" ? "#3d1a1a" : "#1a3d22"}`,
          color:  toast.type==="error" ? "#f87171" : "#4ade80",
          padding:"11px 18px", borderRadius:12, fontSize:13, fontWeight:500,
          display:"flex", alignItems:"center", gap:8,
          boxShadow:"0 8px 32px rgba(0,0,0,.6)",
          animation:"fadeUp .2s ease",
        }}>
          {toast.type==="error" ? <Ic.X /> : <Ic.Check />}
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;