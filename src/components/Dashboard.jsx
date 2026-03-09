import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Icons ────────────────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const Icons = {
  home:      "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  compass:   "M12 2a10 10 0 100 20A10 10 0 0012 2z M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z",
  portfolio: "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z",
  bell:      "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  message:   "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  bookmark:  "M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z",
  settings:  "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  heart:     "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  comment:   "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  share:     "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8 M16 6l-4-4-4 4 M12 2v13",
  plus:      "M12 5v14 M5 12h14",
  search:    "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  logout:    "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  user:      "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  grid:      "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  list:      "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
}

// ── Mock Data ────────────────────────────────────────────────
const mockUser = {
  name: 'Alex Rivera',
  handle: '@alexrivera',
  avatar: 'https://i.pravatar.cc/150?img=11',
  bio: 'Digital illustrator & motion designer. Creating worlds one frame at a time.',
  followers: '12.4k',
  following: 348,
  posts: 94,
}

const mockPosts = [
  { id:1,  user:'Maya Chen',    handle:'@mayac',     avatar:'https://i.pravatar.cc/40?img=5',  img:'https://picsum.photos/seed/art1/400/500',  likes:842,  comments:34, title:'Neon Dreams',        tags:['digital','neon'] },
  { id:2,  user:'Luca Bianchi', handle:'@lucab',     avatar:'https://i.pravatar.cc/40?img=15', img:'https://picsum.photos/seed/art2/400/300',  likes:1203, comments:67, title:'Abstract Flow',      tags:['abstract'] },
  { id:3,  user:'Sara Kim',     handle:'@sarakim',   avatar:'https://i.pravatar.cc/40?img=9',  img:'https://picsum.photos/seed/art3/400/600',  likes:567,  comments:21, title:'Forest Spirit',      tags:['nature','fantasy'] },
  { id:4,  user:'James Obi',    handle:'@jamesobi',  avatar:'https://i.pravatar.cc/40?img=12', img:'https://picsum.photos/seed/art4/400/350',  likes:2341, comments:89, title:'City Pulse',         tags:['urban','photo'] },
  { id:5,  user:'Elena V.',     handle:'@elenav',    avatar:'https://i.pravatar.cc/40?img=7',  img:'https://picsum.photos/seed/art5/400/500',  likes:765,  comments:43, title:'Solitude',           tags:['portrait'] },
  { id:6,  user:'Tom Nakamura', handle:'@tomnaka',   avatar:'https://i.pravatar.cc/40?img=3',  img:'https://picsum.photos/seed/art6/400/400',  likes:432,  comments:15, title:'Geometric Mind',     tags:['geometry'] },
  { id:7,  user:'Priya S.',     handle:'@priyaS',    avatar:'https://i.pravatar.cc/40?img=20', img:'https://picsum.photos/seed/art7/400/550',  likes:987,  comments:52, title:'Ocean Whisper',      tags:['watercolor'] },
  { id:8,  user:'Felix M.',     handle:'@felixm',    avatar:'https://i.pravatar.cc/40?img=8',  img:'https://picsum.photos/seed/art8/400/300',  likes:1456, comments:76, title:'Mechanical Heart',   tags:['sci-fi','mech'] },
]

const suggestedUsers = [
  { name:'Zoe Park',     handle:'@zoepark',   avatar:'https://i.pravatar.cc/40?img=25', tags:'Illustrator' },
  { name:'Ren Tanaka',   handle:'@rentanaka', avatar:'https://i.pravatar.cc/40?img=17', tags:'3D Artist' },
  { name:'Mia Torres',   handle:'@miatorres', avatar:'https://i.pravatar.cc/40?img=22', tags:'Motion' },
]

const notifications = [
  { id:1, text:'Maya Chen liked your post "Night City"',    time:'2m',  avatar:'https://i.pravatar.cc/32?img=5',  unread:true },
  { id:2, text:'Luca started following you',               time:'14m', avatar:'https://i.pravatar.cc/32?img=15', unread:true },
  { id:3, text:'Sara commented: "Absolutely stunning 🔥"', time:'1h',  avatar:'https://i.pravatar.cc/32?img=9',  unread:false },
  { id:4, text:'Your post reached 1k likes!',              time:'3h',  avatar:null,                              unread:false },
]

// ── PostCard ─────────────────────────────────────────────────
const PostCard = ({ post, index }) => {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22,1,0.36,1] }}
      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-lg transition-shadow duration-300 break-inside-avoid mb-4"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={post.img}
          alt={post.title}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Save button */}
        <button
          onClick={() => setSaved(!saved)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/40"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'white' : 'none'} stroke="white" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>

        {/* Tags */}
        <div className="absolute bottom-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {post.tags.map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Card body */}
      <div className="p-3">
        {/* Author */}
        <div className="flex items-center gap-2 mb-2">
          <img src={post.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
          <span className="text-xs text-gray-500 dark:text-white/50 font-medium">{post.handle}</span>
        </div>
        <p className="text-sm font-semibold text-gray-800 dark:text-white mb-2">{post.title}</p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${liked ? 'text-rose-500' : 'text-gray-400 dark:text-white/30 hover:text-rose-400'}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            {liked ? post.likes + 1 : post.likes}
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-white/30 hover:text-[#5044E5] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            {post.comments}
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-white/30 hover:text-[#5044E5] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8 M16 6l-4-4-4 4 M12 2v13" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────
const Dashboard = () => {
  const [activeNav, setActiveNav]   = useState('home')
  const [activeTab, setActiveTab]   = useState('following')
  const [showNotif, setShowNotif]   = useState(false)
  const [following, setFollowing]   = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const unreadCount = notifications.filter(n => n.unread).length

  const navItems = [
    { id:'home',      icon: Icons.home,      label:'Home' },
    { id:'explore',   icon: Icons.compass,   label:'Explore' },
    { id:'portfolio', icon: Icons.portfolio, label:'Portfolio' },
    { id:'messages',  icon: Icons.message,   label:'Messages' },
    { id:'bookmarks', icon: Icons.bookmark,  label:'Bookmarks' },
    { id:'settings',  icon: Icons.settings,  label:'Settings' },
  ]

  return (
    <div className="min-h-screen bg-[#f7f8fc] dark:bg-[#080a0f] text-gray-800 dark:text-white flex font-sans">

      {/* ── LEFT SIDEBAR ── */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-40 flex flex-col
        w-64 bg-white dark:bg-[#0c0e15] border-r border-gray-100 dark:border-white/[0.05]
        transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/[0.05]">
          <span className="text-xl font-black tracking-tight">
            empty<span className="text-[#5044E5]">.art</span>
          </span>
        </div>

        {/* User profile mini */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={mockUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-[#5044E5]/40" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-[#0c0e15]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{mockUser.name}</p>
              <p className="text-xs text-gray-400 dark:text-white/40 truncate">{mockUser.handle}</p>
            </div>
          </div>
          {/* Stats */}
          <div className="flex gap-3 mt-3 text-center">
            {[['Posts', mockUser.posts], ['Followers', mockUser.followers], ['Following', mockUser.following]].map(([label, val]) => (
              <div key={label} className="flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{val}</p>
                <p className="text-[10px] text-gray-400 dark:text-white/35">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeNav === item.id
                  ? 'bg-[#5044E5] text-white shadow-md shadow-[#5044E5]/30'
                  : 'text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon d={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* New Post button */}
        <div className="px-4 pb-4">
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#5044E5]/25">
            <Icon d={Icons.plus} size={16} />
            New Post
          </button>
        </div>

        {/* Logout */}
        <div className="px-4 pb-5">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 dark:text-white/30 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
            <Icon d={Icons.logout} size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 min-w-0 flex flex-col">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#080a0f]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/[0.05] px-4 sm:px-6 py-3 flex items-center gap-4">

          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18 M3 6h18 M3 18h18" />
            </svg>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search artists, artworks…"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-white/[0.05] border border-transparent focus:border-[#5044E5]/40 focus:ring-2 focus:ring-[#5044E5]/10 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-white/30"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
              >
                <Icon d={Icons.bell} size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
                      <span className="text-sm font-bold">Notifications</span>
                      <span className="text-xs text-[#5044E5] font-medium cursor-pointer">Mark all read</span>
                    </div>
                    {notifications.map(n => (
                      <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors ${n.unread ? 'bg-blue-50/50 dark:bg-[#5044E5]/5' : ''}`}>
                        {n.avatar
                          ? <img src={n.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                          : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5044E5] to-[#4d8cea] flex items-center justify-center shrink-0 mt-0.5">
                              <Icon d={Icons.bell} size={12} />
                            </div>
                        }
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 dark:text-white/80 leading-relaxed">{n.text}</p>
                          <p className="text-[10px] text-gray-400 dark:text-white/30 mt-0.5">{n.time} ago</p>
                        </div>
                        {n.unread && <span className="w-1.5 h-1.5 bg-[#5044E5] rounded-full shrink-0 mt-1.5" />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <img src={mockUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover cursor-pointer ring-2 ring-[#5044E5]/30 hover:ring-[#5044E5] transition-all" />
          </div>
        </header>

        {/* Feed tabs */}
        <div className="px-4 sm:px-6 pt-5 pb-0 flex items-center justify-between gap-4">
          <div className="flex gap-1 bg-gray-100 dark:bg-white/[0.04] rounded-xl p-1">
            {['following', 'explore', 'trending'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-white dark:bg-[#0f1117] text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* View toggle placeholder */}
          <div className="flex gap-1">
            {[Icons.grid, Icons.list].map((icon, i) => (
              <button key={i} className={`p-2 rounded-lg transition-colors ${i === 0 ? 'bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.04]'}`}>
                <Icon d={icon} size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 px-4 sm:px-6 pt-5 pb-8">
          {/* Masonry grid */}
          <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
            {mockPosts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </div>
      </main>

      {/* ── RIGHT SIDEBAR ── */}
      <aside className="hidden xl:flex flex-col w-72 shrink-0 sticky top-0 h-screen border-l border-gray-100 dark:border-white/[0.05] bg-white dark:bg-[#0c0e15] px-5 py-6 overflow-y-auto">

        {/* Your Profile card */}
        <div className="rounded-2xl bg-gradient-to-br from-[#5044E5]/10 to-[#4d8cea]/5 border border-[#5044E5]/20 p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <img src={mockUser.avatar} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-[#5044E5]/40" />
            <div>
              <p className="font-bold text-sm">{mockUser.name}</p>
              <p className="text-xs text-gray-400 dark:text-white/40">{mockUser.handle}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed mb-4">{mockUser.bio}</p>
          <button className="w-full py-2 text-xs font-semibold rounded-xl bg-[#5044E5] text-white hover:opacity-90 transition-opacity">
            Edit Profile
          </button>
        </div>

        {/* Suggested to follow */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">Suggested for you</h3>
          <div className="space-y-3">
            {suggestedUsers.map((u, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{u.name}</p>
                  <p className="text-[11px] text-gray-400 dark:text-white/35">{u.tags}</p>
                </div>
                <button
                  onClick={() => setFollowing(prev => ({ ...prev, [u.handle]: !prev[u.handle] }))}
                  className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all duration-200 ${
                    following[u.handle]
                      ? 'border-gray-300 dark:border-white/20 text-gray-500 dark:text-white/40'
                      : 'border-[#5044E5] text-[#5044E5] hover:bg-[#5044E5] hover:text-white'
                  }`}
                >
                  {following[u.handle] ? 'Following' : 'Follow'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trending tags */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">Trending Tags</h3>
          <div className="flex flex-wrap gap-2">
            {['#digitalart','#illustration','#concept','#character','#scifi','#fantasy','#portrait','#animation'].map(tag => (
              <button
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-white/50 hover:bg-[#5044E5]/10 hover:text-[#5044E5] transition-all duration-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}

export default Dashboard
