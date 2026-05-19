import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Clock, Plus, ChefHat } from "lucide-react";

export default async function RecipesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profile, recipes] = await Promise.all([
    prisma.profile.findUnique({ where: { id: user!.id } }),
    prisma.recipe.findMany({
      where: { profileId: user!.id },
      orderBy: { createdAt: "desc" },
      include: {
        recipeIngredients: { select: { id: true } },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#FAF6F2]">
      <div className="bg-gradient-to-br from-[#C4622D] via-[#7A4020]/80 to-[#3D2B1A] px-6 pt-12 pb-16">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ChefHat size={22} className="text-white/80" />
            <span className="text-white/80 text-sm font-medium">
              {profile?.fullName ?? "Chef"}
            </span>
          </div>
          <Link
            href="/recipes/new"
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors text-white text-xs font-semibold px-4 py-2 rounded-full"
          >
            <Plus size={14} />
            Nova receita
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-white mt-4">Minhas Receitas</h1>
        <p className="text-white/60 text-sm mt-1">
          {recipes.length === 0
            ? "Nenhuma receita ainda"
            : `${recipes.length} receita${recipes.length > 1 ? "s" : ""} salva${recipes.length > 1 ? "s" : ""}`}
        </p>
      </div>

      <div className="bg-white rounded-t-3xl -mt-6 px-6 pt-8 pb-12 min-h-96">
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FAF6F2] flex items-center justify-center mb-4">
              <ChefHat size={28} className="text-[#C4622D]/50" />
            </div>
            <h2 className="text-lg font-semibold text-[#3D2B1A] mb-2">
              Nenhuma receita ainda
            </h2>
            <p className="text-sm text-[#3D2B1A]/50 mb-6 max-w-xs">
              Comece adicionando sua primeira receita e monte sua coleção
              pessoal.
            </p>
            <Link
              href="/recipes/new"
              className="inline-flex items-center gap-2 bg-[#C4622D] hover:bg-[#7A4020] transition-colors text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md shadow-[#C4622D]/20"
            >
              <Plus size={16} />
              Criar primeira receita
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recipes.map((recipe, i) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                <div className="group flex items-center justify-between p-4 rounded-2xl border border-[#E8D5C4] bg-[#FAF6F2] hover:border-[#C4622D]/40 hover:bg-white transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#C4622D]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[#C4622D]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-[#3D2B1A] group-hover:text-[#C4622D] transition-colors leading-tight">
                        {recipe.name}
                      </h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-[#7A4020]/60">
                          <Clock size={11} />
                          {recipe.timeToCook} min
                        </span>
                        <span className="text-xs text-[#7A4020]/60">
                          {recipe.recipeIngredients.length} ingrediente
                          {recipe.recipeIngredients.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[#C4622D]/30 group-hover:text-[#C4622D] transition-colors text-lg">
                    →
                  </span>
                </div>
              </Link>
            ))}

            <Link
              href="/recipes/new"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-2 border-dashed border-[#E8D5C4] text-[#C4622D] text-sm font-semibold hover:border-[#C4622D] hover:bg-[#FAF6F2] transition-all mt-1"
            >
              <Plus size={16} />
              Adicionar receita
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
