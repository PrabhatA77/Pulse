import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-4 dark:bg-[#0e1316]">
      <p className="text-xl font-semibold text-[#1a3a5c] dark:text-white">
        Welcome{user ? `, ${user.username}` : ""}!
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        This is a placeholder — the real dashboard isn't built yet.
      </p>
      <button
        onClick={handleLogout}
        className="transition-all duration-300 px-4 py-2 border-none uppercase font-semibold bg-gray-200 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white shadow"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;