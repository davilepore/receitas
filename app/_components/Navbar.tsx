import { Settings, Menu } from "lucide-react";
function Navbar() {
  return (
    <nav className="w-full h-16 bg-white shadow-md flex items-center justify-between px-4">
      <a href="">
        <Menu />
      </a>
      <a href="">Receitas</a>
      <a href="">
        <Settings />
      </a>
    </nav>
  );
}

export default Navbar;
