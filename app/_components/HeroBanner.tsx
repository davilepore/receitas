import { ChevronRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="max-w-[85%] mx-auto h-45 my-8 rounded-4xl bg-linear-to-br from-[#C4622D] via-[#7A4020]/60 to-[#3D2B1A]">
      <div className="p-6 max-w-fit w-40">
        <p className="text-[#3D2B1A]">Receita do dia</p>
        <p className="text-white wrap-break-word text-2xl">
          Macarrão à Carbonara
        </p>
        <button className="inline-flex my-2 items-center gap-1.5 bg-white/15 hover:bg-[#C4622D]/50 border border-white/25 rounded-full px-3.5 py-1 text-white text-[13px] font-medium font-[DM_Sans] transition-colors">
          Ver receita
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
