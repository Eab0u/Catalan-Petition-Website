import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

interface NavItemConfig {
  text: string;
  onClick: () => void;
}

interface RemoteNavItem {
  text: string;
}

function NavItem({ text, onClick }: NavItemConfig) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        cursor-pointer whitespace-nowrap rounded-md bg-transparent px-1 text-2xl font-medium tracking-wide
        text-neutral-900 hover:text-neutral-600
        focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2
        dark:text-white dark:hover:text-neutral-300
        transition-colors duration-150
      "
    >
      {text}
    </button>
  );
}

export default function NavBar() {
  const navigate = useNavigate();

  const [navItems, setNavItems] = useState<NavItemConfig[]>([
    { text: "Informació", onClick: () => document.getElementById("info")?.scrollIntoView() },
    { text: "Sobre nosaltres", onClick: () => document.getElementById("about")?.scrollIntoView() },
    { text: "Seguretat", onClick: () => document.getElementById("security")?.scrollIntoView() },
    { text: "Preguntes freqüents", onClick: () => document.getElementById("FAQ")?.scrollIntoView() },
    { text: "Contacte", onClick: () => alert("Navegar a Contacte") },
  ]);

  useEffect(() => {
    let cancelled = false;

    async function fetchNavItems() {
      try {
        const response = await fetch("/api/navItems");
        if (!response.ok) throw new Error(`Failed to fetch nav items: ${response.status}`);

        const data: RemoteNavItem[] = await response.json();
        if (!cancelled && Array.isArray(data)) {
          setNavItems(
            data.map((item) => ({
              text: item.text,
              onClick: () => alert(`Navigate to ${item.text}`),
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch navigation items", error);
      }
    }

    fetchNavItems();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="fixed left-1/2 top-6 z-50 w-full max-w-7xl -translate-x-1/2 px-4">
      <div
        className="
          flex w-full flex-wrap items-center justify-between gap-4 rounded-3xl border px-6 py-4 shadow-lg backdrop-blur-xl
          sm:flex-nowrap sm:gap-6 sm:px-10
          bg-white/60 border-neutral-300 text-neutral-900
          dark:bg-white/10 dark:border-white/30 dark:text-white
          transition-colors duration-300
        "
      >
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <div
            className="
              flex h-15 w-15 items-center justify-center overflow-hidden rounded-xl
              bg-neutral-100 shadow
              dark:bg-white/10
            "
          >
            <a href="#top">
              <img
                loading="lazy"
                src="/LLEI Logo.png"
                alt="LLEI Logo"
                className="h-15 w-15 object-contain cursor-pointer"
              />
            </a>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex w-full flex-wrap items-center justify-center gap-4 sm:w-auto sm:flex-nowrap">
          {navItems.map((item, index) => (
            <NavItem key={`${item.text}-${index}`} text={item.text} onClick={item.onClick} />
          ))}
        </nav>

        {/* CTA button */}
        <button
          type="button"
          onClick={() => navigate("/under-construction")}
          className="
            cursor-pointer shrink-0 whitespace-nowrap rounded-2xl px-6 py-3 text-sm font-semibold
            bg-neutral-900 text-white hover:bg-neutral-800
            dark:bg-white dark:text-black dark:hover:bg-neutral-200
            transition-colors duration-150
          "
        >
          Signa la Petició
        </button>

        {/* Theme toggle */}
        <div className="cursor-pointer">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
