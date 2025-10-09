import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import AnimatedContent from "./AnimatedContent";
import { gsap } from "gsap";

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
        cursor-pointer whitespace-nowrap rounded-md bg-transparent px-1 text-lg md:text-xl font-medium tracking-wide
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
  const [open, setOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItemConfig[]>([
    { text: "Informació", onClick: () => document.getElementById("info")?.scrollIntoView() },
    { text: "Sobre nosaltres", onClick: () => document.getElementById("about")?.scrollIntoView() },
    { text: "Seguretat", onClick: () => document.getElementById("security")?.scrollIntoView() },
    { text: "Preguntes freqüents & Contacte", onClick: () => document.getElementById("FAQ")?.scrollIntoView() },
    { text: "Documents", onClick: () => navigate("/under-construction") },
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

  // Disable background scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  // Animate dropdown on open
  useEffect(() => {
    if (open) {
      gsap.fromTo(
        "#mobile-dropdown",
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [open]);

  return (
    <header className="fixed left-1/2 top-6 z-50 w-full max-w-7xl -translate-x-1/2 px-4">
      <div
        className="
          flex w-full items-center justify-between rounded-3xl border px-6 py-4 shadow-lg backdrop-blur-xl
          bg-white/60 border-neutral-300 text-neutral-900
          dark:bg-white/10 dark:border-white/30 dark:text-white
          transition-colors duration-300
        "
      >
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <a href="#top" className="flex items-center justify-center">
            <img
              loading="lazy"
              src="/LLEI Logo.png"
              alt="LLEI Logo"
              className="h-12 w-12 object-contain cursor-pointer"
            />
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center justify-center gap-4">
          {navItems.map((item, index) => (
            <NavItem key={`${item.text}-${index}`} text={item.text} onClick={item.onClick} />
          ))}
        </nav>

        {/* Desktop CTA + Theme */}
        <div className="hidden md:flex items-center gap-3">
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

          <div className="cursor-pointer">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden focus:outline-none text-neutral-900 dark:text-white"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ✅ Mobile Dropdown */}
      {open && (
        <div
          id="mobile-dropdown"
          className="
            md:hidden mt-2 flex flex-col items-center gap-4 rounded-3xl border border-neutral-300
            bg-white/70 dark:bg-black/70 dark:border-white/30
            text-neutral-900 dark:text-white shadow-lg backdrop-blur-xl py-6
          "
        >
          {navItems.map((item, index) => (
            <AnimatedContent
              key={`mobile-anim-${item.text}-${index}`}
              distance={20}
              direction="vertical"
              duration={0.5}
              delay={index * 0.1}
              ease="power3.out"
            >
              <NavItem
                text={item.text}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
              />
            </AnimatedContent>
          ))}

          <AnimatedContent
            distance={20}
            direction="vertical"
            duration={0.5}
            delay={navItems.length * 0.1}
            ease="power3.out"
          >
            <button
              type="button"
              onClick={() => {
                navigate("/under-construction");
                setOpen(false);
              }}
              className="
                mt-2 cursor-pointer whitespace-nowrap rounded-2xl px-6 py-3 text-sm font-semibold
                bg-neutral-900 text-white hover:bg-neutral-800
                dark:bg-white dark:text-black dark:hover:bg-neutral-200
                transition-colors duration-150
              "
            >
              Signa la Petició
            </button>
          </AnimatedContent>

          <AnimatedContent
            distance={10}
            direction="vertical"
            duration={0.5}
            delay={(navItems.length + 1) * 0.1}
            ease="power3.out"
          >
            <div className="mt-2">
              <ThemeToggle />
            </div>
          </AnimatedContent>
        </div>
      )}
    </header>
  );
}