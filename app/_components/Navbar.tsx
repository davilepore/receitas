"use client";
import { Settings, Menu } from "lucide-react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";

type Profile = {
  fullName: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
} | null;

function Navbar({ profile }: { profile: Profile }) {
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

        <Link
          href="/settings"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Settings size={22} />
        </Link>
      </nav>

      <Sidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        profile={profile}
      />
    </>
  );
}

export default Navbar;
