import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Landing from "./components/Landing";
import Feed from "./components/Feed";
import Explore from "./components/Explore";
import Profile from "./components/Profile";
import Upload from "./components/Upload";
import Bookmarks from "./components/Bookmarks";
import AdminDashboard from "./components/AdminDashboard";
import PrivateAdminRoute from "./components/PrivateAdminRoute";
import AppNav from "./components/AppNav";

const authedRoutes = ["/feed", "/explore", "/upload", "/bookmarks", "/admin"];

const App = () => {
  const { pathname } = useLocation();
  const showNav =
    authedRoutes.some((r) => pathname.startsWith(r)) ||
    pathname.startsWith("/profile");

  return (
    <div className="dark:bg-[#0a0a0a] min-h-screen relative">
      <Toaster />

      {showNav && <AppNav />}

      <div className={showNav ? "md:ml-[220px] pb-16 md:pb-0" : ""}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route
            path="/admin"
            element={
              <PrivateAdminRoute>
                <AdminDashboard />
              </PrivateAdminRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
