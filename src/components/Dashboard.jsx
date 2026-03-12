import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── DATA ────────────────────────────────────────────────────────────────────

const POSTS = [
  { id: 1, img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700&q=80", user: "Elena Vasquez", handle: "@elenav", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80", likes: 1243, comments: 87, title: "Chromatic Dreamscape", tags: ["digitalart", "conceptart"], time: "2h ago", saved: false },
  { id: 2, img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=700&q=80", user: "Marcus Chen", handle: "@mchen_art", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", likes: 892, comments: 34, title: "Abstract Fluid No. 7", tags: ["abstract", "painting"], time: "5h ago", saved: true },
  { id: 3, img: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=700&q=80", user: "Yuki Tanaka", handle: "@yukidraws", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80", likes: 2104, comments: 156, title: "Neon Solitude", tags: ["illustration", "characterdesign"], time: "8h ago", saved: false },
  { id: 4, img: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=700&q=80", user: "Liam Foster", handle: "@liamfosterart", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80", likes: 3311, comments: 204, title: "Watercolor Bloom", tags: ["watercolor", "botanical"], time: "1d ago", saved: true },
  { id: 5, img: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=700&q=80", user: "Sofia Morales", handle: "@sofiaart", avatar: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=80&q=80", likes: 567, comments: 22, title: "Digital Workshop Setup", tags: ["workspace", "artist"], time: "1d ago", saved: false },
];

const PORTFOLIO = [
  { id: 1, img: "https://images.unsplash.com/photo-1483431974879-e3a67f03fb8f?w=300&q=80", likes: 234 },
  { id: 2, img: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=300&q=80", likes: 891 },
  { id: 3, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80", likes: 445 },
  { id: 4, img: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&q=80", likes: 1203 },
  { id: 5, img: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=300&q=80", likes: 667 },
  { id: 6, img: "https://images.unsplash.com/photo-1610337673044-720471f83677?w=300&q=80", likes: 389 },
];

const SUGGESTED = [
  { name: "Priya Nair",  handle: "@priyanair", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80", followers: "12.4k", specialty: "Concept Art" },
  { name: "Tom Wright",  handle: "@tomwright",  avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80", followers: "8.9k",  specialty: "3D Modeling" },
  { name: "Mei Lin",     handle: "@meilinart",  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80", followers: "21.1k", specialty: "Illustration" },
];

const DISCUSSIONS = [
  { title: "What brush packs do you swear by?",       replies: 43,  trending: true  },
  { title: "AI Detection false positives happening?", replies: 127, trending: true  },
  { title: "Best practices for portfolio curation",   replies: 29,  trending: false },
  { title: "Commission pricing guide 2025",           replies: 88,  trending: false },
];

// ─── ICONS ───────────────────────────────────────────────────────────────────

const IC = {
  Home:      ({ solid }) => <svg width="18" height="18" viewBox="0 0 24 24" fill={solid ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
  Search:    ()           => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bookmark:  ({ solid }) => <svg width="18" height="18" viewBox="0 0 24 24" fill={solid ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  Briefcase: ()           => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  Message:   ()           => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Bell:      ()           => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Heart:     ({ solid }) => <svg width="17" height="17" viewBox="0 0 24 24" fill={solid ? "#f87171" : "none"} stroke={solid ? "#f87171" : "currentColor"} strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Comment:   ()           => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Dots:      ()           => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>,
  Plus:      ()           => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Check:     ()           => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  Shield:    ()           => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Trending:  ()           => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Arrow:     ()           => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Settings:  ()           => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Logout:    ()           => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const NAV = [
  { key: "home",      label: "Home",          Icon: IC.Home      },
  { key: "explore",   label: "Explore",       Icon: IC.Search    },
  { key: "bookmarks", label: "Bookmarks",     Icon: IC.Bookmark  },
  { key: "jobs",      label: "Jobs",          Icon: IC.Briefcase },
  { key: "messages",  label: "Messages",      Icon: IC.Message   },
  { key: "notifs",    label: "Notifications", Icon: IC.Bell, badge: 3 },
];



const Dashboard = () => {
  const navigate = useNavigate();

  const [tab, setTab]               = useState("home");
  const [profileTab, setProfileTab] = useState("portfolio");
  const [posts, setPosts]           = useState(POSTS);
  const [following, setFollowing]   = useState({});
  const [feedRatio, setFeedRatio]   = useState(60);
  const [showFeedCfg, setShowFeedCfg] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
  }, []);

  const toggleLike = (id) =>
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));

  const toggleSave = (id) =>
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, saved: !p.saved } : p
    ));

  const toggleFollow = (handle) =>
    setFollowing(prev => ({ ...prev, [handle]: !prev[handle] }));

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e0e0e0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@1,500&display=swap');

        .db-scroll::-webkit-scrollbar { width: 3px; }
        .db-scroll::-webkit-scrollbar-track { background: transparent; }
        .db-scroll::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }

        .nav-btn { transition: background 0.15s, color 0.15s; border-radius: 10px; }
        .nav-btn:hover { background: #1a1a1a; }
        .nav-btn.is-active { background: #1e1e1e; color: #fff; }

        .post-img { display: block; width: 100%; object-fit: cover; max-height: 440px; transition: transform 0.35s ease; }
        .post-wrap:hover .post-img { transform: scale(1.01); }

        .grid-thumb { position: relative; overflow: hidden; border-radius: 5px; aspect-ratio: 1; }
        .grid-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; display: block; }
        .grid-thumb:hover img { transform: scale(1.07); }
        .grid-thumb .th-over { position: absolute; inset: 0; background: rgba(0,0,0,.55); opacity: 0; display: flex; align-items: center; justify-content: center; transition: opacity .25s; }
        .grid-thumb:hover .th-over { opacity: 1; }

        .tag-pill { transition: background .15s; }
        .tag-pill:hover { background: #262626; }

        .card { background: #141414; border: 1px solid #1e1e1e; border-radius: 16px; overflow: hidden; }

        .feed-item { animation: riseIn .4s ease both; }
        @keyframes riseIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

        .ai-pill  { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:99px; font-size:10px; font-weight:600; letter-spacing:.04em; background:linear-gradient(135deg,#1a3a2a,#0a3d20); border:1px solid #2d6b45; color:#4ade80; }
        .glz-pill { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:99px; font-size:10px; font-weight:600; letter-spacing:.04em; background:linear-gradient(135deg,#1a1a3a,#0d0d4d); border:1px solid #3333aa; color:#818cf8; }

        input[type=range] { -webkit-appearance:none; appearance:none; height:3px; background:#2a2a2a; border-radius:2px; outline:none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:13px; height:13px; border-radius:50%; background:#7c3aed; cursor:pointer; }
      `}</style>

      <div className="flex h-screen overflow-hidden">

        {/* ── LEFT SIDEBAR ─────────────────────────────────── */}
        <aside className="w-[230px] flex-shrink-0 flex flex-col border-r border-[#1a1a1a] py-6 px-3 db-scroll overflow-y-auto">

          <div className="flex items-center gap-2 px-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-800 flex items-center justify-center font-bold text-white text-sm">C</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }} className="text-[1.15rem] text-white tracking-tight">Cara</span>
            <span className="ml-1 text-[9px] bg-[#1e1e1e] text-[#555] px-1.5 py-0.5 rounded">beta</span>
          </div>

          <nav className="flex flex-col gap-0.5 flex-1">
            {NAV.map(({ key, label, Icon, badge }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`nav-btn flex items-center gap-3 px-3 py-2.5 text-sm w-full text-left ${tab === key ? "is-active" : "text-[#666]"}`}
              >
                <Icon solid={tab === key} />
                <span>{label}</span>
                {badge && (
                  <span className="ml-auto text-[10px] bg-violet-600 text-white w-[18px] h-[18px] rounded-full flex items-center justify-center font-semibold">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="border-t border-[#1a1a1a] my-3" />

          <div className="px-2 flex items-center gap-2.5 mb-3">
            <img src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=80&q=80" alt="me" className="w-9 h-9 rounded-full object-cover border border-[#2a2a2a] flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-white font-medium leading-tight truncate">Jamie Kim</p>
              <p className="text-xs text-[#555] truncate">@jamiekim</p>
            </div>
          </div>

          <button
            className="mx-2 mb-2 bg-violet-700 hover:bg-violet-600 text-white rounded-xl py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <IC.Plus /> New Post
          </button>

          <button
            onClick={handleLogout}
            className="mx-2 flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#555] hover:text-[#aaa] hover:bg-[#1a1a1a] transition-colors"
          >
            <IC.Logout /> Log out
          </button>

          <div className="px-2 pt-4 flex flex-col gap-1.5">
            <span className="ai-pill"><IC.Check /> AI-Free Portfolio</span>
            <span className="glz-pill"><IC.Shield /> Glaze Protected</span>
          </div>
        </aside>

        {/* ── MAIN FEED ────────────────────────────────────── */}
        <main className="flex-1 db-scroll overflow-y-auto">

          <div className="sticky top-0 z-20 bg-[#0f0f0f]/90 backdrop-blur border-b border-[#1a1a1a] px-6 py-2.5 flex items-center justify-between">
            <div className="flex gap-1">
              {["Home", "Following", "Explore"].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t.toLowerCase())}
                  className={`px-3.5 py-1.5 rounded-lg text-sm transition-colors ${tab === t.toLowerCase() ? "bg-[#1e1e1e] text-white" : "text-[#555] hover:text-[#999]"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFeedCfg(v => !v)}
              className="flex items-center gap-1.5 text-xs text-[#555] hover:text-[#999] px-3 py-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <IC.Settings /> Customize Feed
            </button>
          </div>

          {showFeedCfg && (
            <div className="mx-6 mt-4 p-4 bg-[#141414] border border-[#1e1e1e] rounded-2xl">
              <p className="text-sm text-white font-medium mb-3">Feed Ratio</p>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs text-[#666] mb-1">
                    <span>People You Follow</span>
                    <span className="text-violet-400">{feedRatio}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={feedRatio} onChange={e => setFeedRatio(+e.target.value)} className="w-full" />
                </div>
                <div className="flex justify-between text-xs text-[#555]">
                  <span>Your Follow's Network</span><span className="text-violet-400">{Math.round((100 - feedRatio) * 0.6)}%</span>
                </div>
                <div className="flex justify-between text-xs text-[#555]">
                  <span>Cara Site-Wide</span><span className="text-violet-400">{Math.round((100 - feedRatio) * 0.4)}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="px-6 py-5 space-y-6 max-w-[620px]">
            {posts.map((p, i) => (
              <div key={p.id} className="card post-wrap feed-item" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <div className="flex items-center gap-2.5">
                    <img src={p.avatar} alt={p.user} className="w-9 h-9 rounded-full object-cover border border-[#252525]" />
                    <div>
                      <p className="text-sm text-white font-medium leading-none mb-0.5">{p.user}</p>
                      <p className="text-xs text-[#484848]">{p.handle} · {p.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="ai-pill"><IC.Check /> Human</span>
                    <button className="text-[#444] hover:text-[#888] transition-colors p-1"><IC.Dots /></button>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <img src={p.img} alt={p.title} className="post-img" />
                </div>

                <div className="flex items-center gap-4 px-4 pt-3 pb-1">
                  <button onClick={() => toggleLike(p.id)} className={`flex items-center gap-1.5 text-sm transition-colors ${p.liked ? "text-red-400" : "text-[#666] hover:text-white"}`}>
                    <IC.Heart solid={p.liked} /><span>{p.likes.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-[#666] hover:text-white transition-colors">
                    <IC.Comment /><span>{p.comments}</span>
                  </button>
                  <button onClick={() => toggleSave(p.id)} className={`ml-auto transition-colors ${p.saved ? "text-violet-400" : "text-[#666] hover:text-white"}`}>
                    <IC.Bookmark solid={p.saved} />
                  </button>
                </div>

                <div className="px-4 pb-4 pt-1">
                  <p className="text-sm text-[#bbb] mb-2">
                    <span className="text-white font-medium mr-1">{p.user}</span>{p.title}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map(tag => (
                      <span key={tag} className="tag-pill text-xs text-[#666] bg-[#191919] border border-[#222] px-2.5 py-0.5 rounded-full cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>


        <aside className="w-[268px] flex-shrink-0 border-l border-[#1a1a1a] db-scroll overflow-y-auto py-5 px-4 space-y-5">

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a3a3a]"><IC.Search /></span>
            <input type="text" placeholder="Search artists, tags..." className="w-full bg-[#141414] border border-[#1e1e1e] rounded-xl pl-8 pr-3 py-2 text-sm text-[#ccc] placeholder-[#3a3a3a] outline-none focus:border-violet-700 transition-colors" />
          </div>


          <div className="card">
            <div className="h-14 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1682687220499-d9c06b872f6b?w=400&q=80" alt="" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#141414]/60" />
            </div>
            <div className="px-4 pb-4 -mt-5">
              <img src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=80&q=80" alt="me" className="w-11 h-11 rounded-full object-cover border-2 border-[#0f0f0f] mb-2" />
              <p className="text-white text-sm font-semibold">Jamie Kim</p>
              <p className="text-[#484848] text-xs mb-3">Concept artist · Seoul</p>
              <div className="flex gap-4 text-xs mb-3">
                {[["1.2k","Following"],["8.4k","Followers"],["94","Posts"]].map(([n,l]) => (
                  <div key={l}><p className="text-white font-semibold">{n}</p><p className="text-[#484848]">{l}</p></div>
                ))}
              </div>
              <div className="flex gap-1 mb-2">
                {["portfolio","feed"].map(t => (
                  <button key={t} onClick={() => setProfileTab(t)} className={`flex-1 text-xs py-1.5 rounded-lg capitalize transition-colors ${profileTab === t ? "bg-violet-800 text-white" : "text-[#484848] hover:text-[#999]"}`}>{t}</button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {PORTFOLIO.map(p => (
                  <div key={p.id} className="grid-thumb cursor-pointer">
                    <img src={p.img} alt="" />
                    <div className="th-over">
                      <span className="text-white text-[11px] font-medium flex items-center gap-1">
                        <IC.Heart solid /> {p.likes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <div className="card p-4">
            <p className="text-[10px] font-semibold text-[#3a3a3a] uppercase tracking-widest mb-3">Suggested Artists</p>
            <div className="space-y-3">
              {SUGGESTED.map(a => (
                <div key={a.handle} className="flex items-center gap-2.5">
                  <img src={a.avatar} alt={a.name} className="w-8 h-8 rounded-full object-cover border border-[#252525] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate leading-tight">{a.name}</p>
                    <p className="text-xs text-[#484848] truncate">{a.specialty} · {a.followers}</p>
                  </div>
                  <button
                    onClick={() => toggleFollow(a.handle)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 flex-shrink-0 ${following[a.handle] ? "border-violet-700 text-violet-400 bg-violet-900/20" : "border-[#2a2a2a] text-[#777] hover:border-violet-700 hover:text-violet-400"}`}
                  >
                    {following[a.handle] ? <><IC.Check /> Following</> : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </div>


          <div className="card p-4">
            <p className="text-[10px] font-semibold text-[#3a3a3a] uppercase tracking-widest mb-3">Latest Discussions</p>
            <div className="space-y-3">
              {DISCUSSIONS.map((d, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex items-start gap-1.5">
                    {d.trending && <span className="text-orange-500 mt-0.5 flex-shrink-0"><IC.Trending /></span>}
                    <p className={`text-[13px] text-[#888] group-hover:text-white transition-colors leading-snug ${!d.trending ? "ml-[18px]" : ""}`}>{d.title}</p>
                  </div>
                  <p className="text-[11px] text-[#333] mt-0.5 ml-[18px]">{d.replies} replies</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4 border border-[#252560] bg-gradient-to-br from-[#111030] to-[#0c0c28]">
            <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest mb-1.5">Jobs Board</p>
            <p className="text-sm text-white font-medium mb-0.5">3 new listings from AAA studios</p>
            <p className="text-xs text-[#484848] mb-3">FromSoftware · Kojima Productions · WildBrain</p>
            <button className="w-full flex items-center justify-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 border border-[#2a2a70] hover:border-indigo-600 py-1.5 rounded-xl transition-colors">
              View Openings <IC.Arrow />
            </button>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 pb-4 px-1">
            {["Privacy", "Terms", "About", "Blog", "Support EmptyArt"].map(l => (
              <span key={l} className="text-[11px] text-[#2e2e2e] hover:text-[#666] cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;


