import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/tools/image-converter", label: "Image Converter" },
  { to: "/tools/batch-resizer", label: "Batch Resizer" },
  { to: "/tools/qr-generator", label: "QR Code" },
  { to: "/tools/watermark", label: "Watermark" },
  { to: "/tools/tts", label: "Text to Speech" },
  { to: "/tools/image-gen", label: "Image Gen" },
];

export const Header = () => {
  return (
    <header className="w-full border-b sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:backdrop-blur bg-background/70">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="h-3 w-3 rounded-full bg-primary shadow-[var(--shadow-glow)]" />
          <span>AI Tools Hub</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? "" : ""}>
              <Button variant="ghost" size="sm">{item.label}</Button>
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="https://docs.lovable.dev/" target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">Docs</Button>
          </a>
          <Link to="/tools/image-gen">
            <Button variant="hero" size="sm">Try Now</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
