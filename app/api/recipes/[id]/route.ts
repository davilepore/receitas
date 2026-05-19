import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const recipe = await prisma.recipe.findUnique({ where: { id } });

  if (!recipe) {
    return NextResponse.json({ error: "Receita não encontrada" }, { status: 404 });
  }

  if (recipe.profileId !== user.id) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }


  await prisma.recipeIngredient.deleteMany({ where: { recipeId: id } });
  await prisma.recipe.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}