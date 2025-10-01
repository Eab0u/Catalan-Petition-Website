import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      className="cursor-pointer whitespace-nowrap rounded-md bg-transparent px-1 text-sm font-medium tracking-wide text-white transition-colors duration-150 hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      {text}
    </button>
  );
}

export default function NavBar() {
  const navigate = useNavigate();

  const [navItems, setNavItems] = useState<NavItemConfig[]>([
    { text: "Info", onClick: () => alert("Navigate to Info") },
    { text: "About", onClick: () => alert("Navigate to About") },
    { text: "Security", onClick: () => alert("Navigate to Security") },
    { text: "FAQ", onClick: () => alert("Navigate to FAQ") },
    { text: "Contact", onClick: () => alert("Navigate to Contact") },
  ]);

  useEffect(() => {
    let cancelled = false;

    async function fetchNavItems() {
      try {
        const response = await fetch("/api/navItems");
        if (!response.ok) {
          throw new Error(`Failed to fetch nav items: ${response.status}`);
        }

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
    <header className="fixed left-1/2 top-6 z-50 w-full max-w-5xl -translate-x-1/2 px-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/30 bg-white/10 px-6 py-4 shadow-lg backdrop-blur-xl sm:flex-nowrap sm:gap-6 sm:px-10">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow">
            <img
              loading="lazy"
              src="/GDClogo.png"
              alt="Generalitat de Catalunya logo"
              className="h-6 w-6 object-contain"
            />
          </div>
          <span className="font-vastago text-lg font-extrabold uppercase tracking-[0.25em] text-neutral-100">
            Generalitat De Catalunya
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex w-full flex-wrap items-center justify-center gap-4 text-white sm:w-auto sm:flex-nowrap">
          {navItems.map((item, index) => (
            <NavItem key={`${item.text}-${index}`} text={item.text} onClick={item.onClick} />
          ))}
        </nav>

        {/* CTA button */}
        <button
          type="button"
          onClick={() => navigate("/sign")}
          className="cursor-pointer shrink-0 whitespace-nowrap rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition-colors duration-150 hover:bg-neutral-800"
        >
          Signa la Petició
        </button>
      </div>
    </header>
  );
}
