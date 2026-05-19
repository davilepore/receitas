import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { name, description, timeToCook, ingredients } = await req.json();

  if (!name || !timeToCook || !Array.isArray(ingredients)) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const recipe = await prisma.recipe.create({
    data: {
      name,
      description: description ?? "",
      timeToCook: Number(timeToCook),
      profileId: user.id,
      recipeIngredients: {
        create: await Promise.all(
          ingredients.map(async (ing: { name: string; quantity: string; unity: string }) => {
            const ingredient = await prisma.ingredient.upsert({
              where: { name: ing.name.toLowerCase() },
              update: {},
              create: { name: ing.name.toLowerCase() },
            });

            return {
              quantity: ing.quantity,
              unity: ing.unity,
              ingredient: { connect: { id: ingredient.id } },
            };
          })
        ),
      },
    },
  });

  return NextResponse.json(recipe, { status: 201 });
}