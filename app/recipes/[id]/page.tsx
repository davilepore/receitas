import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Clock, ChevronLeft, User } from "lucide-react";
import { DeleteButton } from "./DeleteButton";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      recipeIngredients: {
        include: { ingredient: true },
      },
      profile: true,
    },
  });

  if (!recipe) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === recipe.profileId;

  return (
    <div className="min-h-screen bg-[#FAF6F2]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#C4622D] via-[#7A4020]/80 to-[#3D2B1A] px-6 pt-12 pb-16">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-1 text-white/70 text-sm mb-6 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
          Voltar
        </Link>

        <h1 className="text-3xl font-bold text-white leading-tight mb-3">
          {recipe.name}
        </h1>

        <div className="flex items-center gap-4 text-white/70 text-sm">
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {recipe.timeToCook} min
          </span>
          {recipe.profile && (
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {recipe.profile.fullName ?? "Chef"}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="bg-white rounded-t-3xl -mt-6 px-6 pt-8 pb-12 min-h-96">
        {/* Descrição */}
        {recipe.description && (
          <div className="mb-8">
            <p className="text-[#3D2B1A]/70 text-sm leading-relaxed">
              {recipe.description}
            </p>
          </div>
        )}

        {/* Ingredientes */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-[#7A4020]/60 uppercase tracking-widest mb-4">
            Ingredientes ({recipe.recipeIngredients.length})
          </h2>

          <div className="flex flex-col divide-y divide-[#E8D5C4]">
            {recipe.recipeIngredients.map((ri) => (
              <div
                key={ri.id}
                className="flex items-center justify-between py-3"
              >
                <span className="text-sm text-[#3D2B1A] capitalize">
                  {ri.ingredient.name}
                </span>
                <span className="text-sm font-medium text-[#C4622D]">
                  {ri.quantity} {ri.unity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações do dono */}
        {isOwner && (
          <div className="flex gap-3 pt-4 border-t border-[#E8D5C4]">
            <Link
              href={`/recipes/${recipe.id}/edit`}
              className="flex-1 py-3 rounded-xl border border-[#C4622D] text-[#C4622D] text-sm font-semibold text-center transition-colors hover:bg-[#FAF6F2]"
            >
              Editar
            </Link>
            <DeleteButton recipeId={recipe.id} />
          </div>
        )}
      </div>
    </div>
  );
}
