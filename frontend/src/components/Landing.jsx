import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { api, getToken } from "../api";
import toast from "react-hot-toast";

const SHOWCASE = [
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1558522195-e1201b090344?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1584804738473-a49b7441c464?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&auto=format&fit=crop&q=60",
];

export default function Landing() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) navigate("/feed", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const t = setInterval(() => setImgIdx((i) => (i + 1) % SHOWCASE.length), 4000);
    return () => clearInterval(t);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);

    try {
      const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const result = await api(endpoint, { method: "POST", body: data });

      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.user.role);

      if (result.user.role === "admin") navigate("/admin");
      else navigate("/feed");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Left — showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIdx}
            src={SHOWCASE[imgIdx]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            alt=""
          />
        </AnimatePresence>
        <div className="relative z-10 text-center px-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-800 flex items-center justify-center font-bold text-white text-xl">
              E
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">
              EmptyArt
            </span>
          </div>
          <p className="text-white/80 text-lg max-w-sm mx-auto leading-relaxed">
            Share your art. Discover new creators. Connect with an inspiring community.
          </p>
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-800 flex items-center justify-center font-bold text-white text-lg">
              E
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              EmptyArt
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#282828] rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-[#282828]">
              {["login", "signup"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMode(tab)}
                  className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                    mode === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {tab === "signup" ? "Create Account" : "Sign In"}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: isSignup ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isSignup ? -20 : 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-4"
                >
                  {isSignup && (
                    <input
                      name="username"
                      placeholder="Username"
                      required
                      className="input-field"
                    />
                  )}
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="input-field"
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    minLength={6}
                    className="input-field"
                  />
                </motion.div>
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : isSignup
                  ? "Create Account"
                  : "Sign In"}
              </button>
            </form>

            <p className="pb-6 text-center text-sm text-gray-400 dark:text-gray-500">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setMode(isSignup ? "login" : "signup")}
                className="text-primary font-semibold hover:underline"
              >
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
