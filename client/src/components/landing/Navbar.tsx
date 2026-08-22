import logo from "../../assets/logo.png";
import { useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import ProfileDropdown from "./ProfileDropdown";

const NAV_LINK_CLASS =
  "transition-all duration-300 hover:text-[#1a3a5c] dark:hover:text-[#019bf0] py-1 px-2 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-800 dark:text-gray-300";

const Navbar = () => {
  const { isAuthenticated } = useAuthStore();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setIsDark(isDark);
  };

  return (
    <div className="transition-all duration-300 border-none bg-gray-200 dark:bg-[#0e1316] relative w-full">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* logo image and name and sub-heading*/}
        <div className="flex items-center gap-4 sm:gap-10">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Pulse" className="h-10 sm:h-12 lg:h-15" />
            <p className="text-2xl font-bold text-[#1a3a5c] dark:text-[#019bf0] sm:text-3xl lg:text-5xl">
              PULSE
            </p>
          </Link>

          {/* Product/Features — hidden on small screens, in the mobile menu instead */}
          <div className="hidden gap-5 md:flex">
            <div className={NAV_LINK_CLASS}>Product</div>
            <div className={NAV_LINK_CLASS}>Features</div>
          </div>
        </div>

        {/* theme toggle (always visible) + auth actions (desktop only) */}
        <div className="flex items-center gap-3">
          <button
            className="transition-all duration-300 dark:text-white"
            onClick={toggleTheme}
          >
            {!isDark ? <Moon className="..." /> : <Sun className="..." />}
          </button>

          {isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link to="/signup" className={NAV_LINK_CLASS}>
                Signup
              </Link>
              <Link to="/login" className={NAV_LINK_CLASS}>
                Login
              </Link>
            </div>
          )}

          <button
            className="dark:text-white md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`grid transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 border-t border-gray-300 px-4 pb-4 pt-2 dark:border-gray-800 sm:px-6 lg:px-8">
            <div className={NAV_LINK_CLASS}>Product</div>
            <div className={NAV_LINK_CLASS}>Features</div>
            {!isAuthenticated && (
              <>
                <Link
                  to="/signup"
                  className={NAV_LINK_CLASS}
                  onClick={() => setMenuOpen(false)}
                >
                  Signup
                </Link>
                <Link
                  to="/login"
                  className={NAV_LINK_CLASS}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
