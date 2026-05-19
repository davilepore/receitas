import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { ChefHat, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

async function MyRecipes() {
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
    <>
      <div className="py-8">
        <div className="flex items-center justify-between px-8 mb-2">
          <h2 className="font-bold text-2xl text-[#3D2B1A]">Minhas Receitas</h2>

          <Link
            href={"/recipes"}
            className="inline-flex items-center gap-1.5 text-sm text-[#7A4020] hover:text-[#C4622D] transition-colors cursor-pointer"
          >
            Ver todas
            <ChevronRight size={14} />
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
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
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full px-8"
          >
            <CarouselContent className="-ml-3">
              {recipes.map((recipe) => (
                <CarouselItem
                  key={recipe.id}
                  className="pl-3 basis-[75%] md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="overflow-hidden">
                    <img
                      src="/prato.png"
                      alt={recipe.name}
                      className="w-full h-[140px] object-cover"
                    />

                    <CardContent className="p-4">
                      <h3 className="text-base font-semibold leading-tight">
                        {recipe.name}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {recipe.description}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        )}
      </div>
    </>
  );
}

export default MyRecipes;
