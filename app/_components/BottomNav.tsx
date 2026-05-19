import { Heart, House, Plus, Search, User } from "lucide-react";

function BottomNav() {
  return (
    <div className="fixed w-full bottom-0 left-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center z-50">
      <NavItem icon={<House size={18} />} label="Início" />
      <NavItem icon={<Search size={18} />} label="Buscar" />

      <a
        href="#"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#C4622D] text-white -mt-6 shadow-md hover:bg-[#a8501f] transition-colors"
        aria-label="Adicionar receita"
      >
        <Plus size={22} />
      </a>

      <NavItem icon={<Heart size={18} />} label="Favoritas" />
      <NavItem icon={<User size={18} />} label="Perfil" />
    </div>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <a
      href="#"
      className="flex text-2xl font-semibold flex-col items-center gap-1 px-3 py-2 rounded-xl text-gray-400 hover:text-[#C4622D] hover:bg-orange-50 transition-colors group"
    >
      <span className="group-hover:text-[#C4622D] transition-colors">
        {icon}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </a>
  );
}

export default BottomNav;
