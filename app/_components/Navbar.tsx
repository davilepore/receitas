"use client";
import { Settings, Menu } from "lucide-react";
import { useState } from "react";
import Sidebar from "./Sidebar";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="w-full h-16 bg-white shadow-md flex items-center justify-between px-4 relative z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>

        <a href="" className="font-semibold text-gray-800">
          Receitas
        </a>

        <a
          href=""
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Settings size={22} />
        </a>
      </nav>

      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default Navbar;
