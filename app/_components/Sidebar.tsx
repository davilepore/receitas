"use client";
import {
  X,
  User,
  BookOpen,
  Compass,
  Settings,
  ChefHat,
  Heart,
  CircleQuestionMark,
} from "lucide-react";
import { useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ChefHat className="text-orange-500" size={22} />
            <span className="text-lg font-bold tracking-tight text-gray-800">
              Sabor<span className="text-orange-500">IA</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative mb-4">
          <div className="h-30 bg-gradient-to-r from-orange-400 to-amber-300" />

          <div className="absolute left-4 top-20 w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-md">
            <img
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=Maria"
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="pt-10 px-4">
            <p className="font-semibold text-gray-800">Maria Silva</p>
            <p className="text-xs text-gray-400">maria@email.com</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <NavItem icon={<User size={18} />} label="Minha Conta" />
          <NavItem icon={<BookOpen size={18} />} label="Minhas Receitas" />
          <NavItem icon={<Compass size={18} />} label="Descobrir Receitas" />
          <NavItem icon={<Heart size={18} />} label="Favoritas" />
        </nav>

        <div className="px-3 pb-6 border-t border-gray-100 pt-3">
          <NavItem icon={<Settings size={18} />} label="Configurações" />
          <NavItem
            icon={<CircleQuestionMark size={18} />}
            label="Ajuda e Suporte"
          />
        </div>
      </aside>
    </>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <a
      href="#"
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors group"
    >
      <span className="text-gray-400 group-hover:text-orange-500 transition-colors">
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}

export default Sidebar;
