import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Problems", href: "/problems" },
  ],
  Company: [{ label: "About", href: "/about" }],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const SOCIAL_ICONS = [
  { id: "github-icon", label: "GitHub" },
  { id: "x-icon", label: "X" },
  { id: "discord-icon", label: "Discord" },
];

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-300 bg-gray-200 px-4 py-4 dark:border-gray-800 dark:bg-[#0e1316] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Brand & Socials inline */}
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="flex items-center gap-1.5">
            <img src={logo} alt="Pulse" className="h-5 w-auto" />
            <span className="text-sm font-bold tracking-tight text-[#1a3a5c] dark:text-[#019bf0]">
              PULSE
            </span>
          </Link>

          <span className="hidden text-xs text-gray-400 dark:text-gray-600 sm:inline">
            |
          </span>

          <div className="flex items-center gap-1.5">
            {SOCIAL_ICONS.map((icon) => (
              <a
                key={icon.id}
                href="#"
                aria-label={icon.label}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300/60 text-gray-700 transition-all duration-300 hover:bg-[#019bf0]/15 hover:text-[#019bf0] dark:bg-gray-800/60 dark:text-gray-300"
              >
                <svg className="h-3 w-3 fill-current" aria-hidden="true">
                  <use href={`/icons.svg#${icon.id}`} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Flat single-line links */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-600 dark:text-gray-400">
          {Object.values(FOOTER_LINKS)
            .flat()
            .map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="transition-colors hover:text-[#1a3a5c] dark:hover:text-[#019bf0]"
              >
                {link.label}
              </Link>
            ))}
        </div>
      </div>

      <div className="mx-auto mt-3 w-full max-w-7xl border-t border-gray-300/40 pt-2 text-center text-[10px] text-gray-500 dark:border-gray-800/40 dark:text-gray-500">
        © {new Date().getFullYear()} Pulse. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
