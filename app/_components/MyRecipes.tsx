import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { ChevronRight } from "lucide-react";

function MyRecipes() {
  const minhasReceitas = [
    {
      id: 1,
      title: "Receita 1",
      description: "Descrição da receita 1",
      imagem: "/prato.jpg",
    },
    {
      id: 2,
      title: "Receita 2",
      description: "Descrição da receita 2",
      imagem: "/prato.jpg",
    },
    {
      id: 3,
      title: "Receita 3",
      description: "Descrição da receita 3",
      imagem: "/prato.jpg",
    },
  ];
  return (
    <div className="py-8">
      <div className="flex items-center justify-between px-8 mb-2">
        <h2 className="font-bold text-2xl text-[#3D2B1A]">Minhas Receitas</h2>
        <p className="inline-flex items-center gap-1.5 text-sm text-[#7A4020] hover:text-[#C4622D] transition-colors cursor-pointer">
          Ver todas
          <ChevronRight size={14} />
        </p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full px-8"
      >
        <CarouselContent className="-ml-3">
          {minhasReceitas.map((receita) => (
            <CarouselItem
              key={receita.id}
              className="pl-3 basis-[75%] md:basis-1/2 lg:basis-1/3"
            >
              <Card className="overflow-hidden">
                <img
                  src={receita.imagem}
                  alt={receita.title}
                  className="w-full h-[140px] object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="text-base font-semibold leading-tight">
                    {receita.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {receita.description}
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>
    </div>
  );
}

export default MyRecipes;
