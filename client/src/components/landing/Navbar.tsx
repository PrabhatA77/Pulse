// client/src/components/landing/Navbar.tsx
import logo from "../../assets/logo.png";
import { useEffect, useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import ProfileDropdown from "./ProfileDropdown";

const NAV_LINK_CLASS =
  "transition-all duration-300 hover:text-[#1a3a5c] dark:hover:text-[#019bf0] py-1 px-2 rounded-2xl hover:bg-gray-300/60 dark:hover:bg-gray-800/60 dark:text-gray-300";

// Scrolls smoothly to a section on the landing page, accounting for the
// sticky navbar's height via the target's `scroll-mt-*` class.
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const Navbar = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Toggles a slightly stronger shadow/border once the page has scrolled
  // past the hero, so the glass navbar reads as "elevated" over content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setIsDark(isDark);
  };

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <div
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-zinc-200/70 bg-gray-200/70 shadow-sm backdrop-blur-xl dark:border-white/5 dark:bg-[#0e1316]/70"
          : "border-transparent bg-gray-200/40 backdrop-blur-md dark:bg-[#0e1316]/40"
      }`}
    >
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
            <button type="button" className={NAV_LINK_CLASS} onClick={() => handleNavClick("hero")}>
              Product
            </button>
            <button type="button" className={NAV_LINK_CLASS} onClick={() => handleNavClick("features")}>
              Features
            </button>
          </div>
        </div>

        {/* theme toggle (always visible) + auth actions (desktop only) */}
        <div className="flex items-center gap-3">
          <button
            className="transition-all duration-300 dark:text-white"
            onClick={toggleTheme}
          >
            {!isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {isLoading ? null : isAuthenticated ? (
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
          <div className="mx-auto flex max-w-7xl flex-col gap-1 border-t border-gray-300/60 px-4 pb-4 pt-2 dark:border-gray-800/60 sm:px-6 lg:px-8">
            <button type="button" className={`${NAV_LINK_CLASS} text-left`} onClick={() => handleNavClick("hero")}>
              Product
            </button>
            <button type="button" className={`${NAV_LINK_CLASS} text-left`} onClick={() => handleNavClick("features")}>
              Features
            </button>
            {!isLoading && !isAuthenticated && (
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