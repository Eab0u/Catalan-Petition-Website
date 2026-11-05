import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import AnimatedContent from "./AnimatedContent";
import { gsap } from "gsap";
import { SIGN_PATH } from "../utils/signing";

interface NavItemConfig {
  text: string;
  onClick: () => void;
}

function NavItem({ text, onClick }: NavItemConfig) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group relative cursor-pointer whitespace-nowrap rounded-md bg-transparent
        px-2 py-3 text-lg md:text-xl font-medium tracking-wide
        text-neutral-900 hover:text-neutral-600
        dark:text-white dark:hover:text-neutral-300
        transition-colors duration-150
      "
    >
      {text}
      <span
        className="
          pointer-events-none absolute left-2 right-2 bottom-1.5 h-0.5 scale-x-0
          bg-senyera-red transition-transform duration-200 group-hover:scale-x-100
        "
      />
    </button>
  );
}

export default function NavBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const navItems: NavItemConfig[] = [
    { text: "Informació", onClick: () => document.getElementById("info")?.scrollIntoView() },
    { text: "Sobre...", onClick: () => document.getElementById("about")?.scrollIntoView() },
    { text: "Seguretat", onClick: () => document.getElementById("security")?.scrollIntoView() },
    { text: "Preguntes freqüents & Contacte", onClick: () => document.getElementById("FAQ")?.scrollIntoView() },
    { text: "Documents", onClick: () => navigate("/documents") },
  ];

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
    <header className="fixed left-1/2 top-[max(1.5rem,env(safe-area-inset-top))] z-50 w-full max-w-7xl -translate-x-1/2 px-4">
      <div
        className="
          flex w-full items-center justify-between rounded-3xl border px-4 py-3 sm:px-6 sm:py-4 shadow-lg backdrop-blur-xl
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
              className="h-11 w-11 sm:h-12 sm:w-12 object-contain cursor-pointer"
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
            onClick={() => navigate(SIGN_PATH)}
            className="
              cursor-pointer shrink-0 whitespace-nowrap rounded-2xl px-6 py-3 text-sm font-semibold
              bg-senyera-red text-white hover:bg-senyera-yellow hover:text-black
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
          aria-expanded={open}
          aria-controls="mobile-dropdown"
          aria-label={open ? "Tancar el menú" : "Obrir el menú"}
          className="md:hidden flex h-11 w-11 items-center justify-center text-neutral-900 dark:text-white"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div
          id="mobile-dropdown"
          className="
            md:hidden mt-2 flex flex-col items-center gap-4 rounded-3xl border border-neutral-300
            bg-white/70 dark:bg-black/70 dark:border-white/30
            text-neutral-900 dark:text-white shadow-lg backdrop-blur-xl py-6
            safe-area-bottom max-h-[75dvh] overflow-y-auto
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
                navigate(SIGN_PATH);
                setOpen(false);
              }}
              className="
                mt-2 cursor-pointer whitespace-nowrap rounded-2xl px-6 py-3 text-sm font-semibold
                bg-senyera-red text-white hover:bg-senyera-yellow hover:text-black
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