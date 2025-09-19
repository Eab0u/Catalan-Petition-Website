import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="fixed top-30 left-1/2 -translate-x-1/2 flex items-center justify-between w-[60%] max-w-6xl px-10 py-3 rounded-full bg-gradient-to-r from-[#4ba2ff] to-[#b8e3ff] shadow-lg font-vastago z-50">
      {/* Left logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md">
          <span className="text-xs font-bold text-catalanBlue">&lt;ADC/&gt;</span>
        </div>
        <span className="font-bold text-gray-900">App Dev Club</span>
      </div>

      {/* Right links */}
      <ul className="flex items-center gap-10 list-none m-0 p-0 text-gray-800 font-medium">
        <li><Link to="/about" className="hover:text-catalanBlue">About</Link></li>
        <li><Link to="/projects" className="hover:text-catalanBlue">Projects</Link></li>
        <li><Link to="/sponsors" className="hover:text-catalanBlue">Sponsors</Link></li>
        <li><Link to="/contact" className="hover:text-catalanBlue">Contact Us</Link></li>
        <li>
          <Link
            to="/apply"
            className="px-4 py-1.5 rounded-full bg-white text-catalanBlue font-semibold shadow hover:bg-gray-100 transition"
          >
            Apply Now
          </Link>
        </li>
      </ul>
    </nav>
  );
}
