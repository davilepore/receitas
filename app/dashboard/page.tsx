import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profile, recipes] = await Promise.all([
    prisma.profile.findUnique({ where: { id: user!.id } }),
    prisma.recipe.findMany({
      where: { profileId: user!.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <p className="text-sm mb-1" style={{ color: "var(--ink-muted)" }}>
          Bem-vindo de volta,
        </p>
        <h1 className="font-display text-4xl" style={{ color: "var(--ink)" }}>
          {profile?.fullName?.split(" ")[0] ?? "Chef"}
        </h1>
      </div>

      <div
        className="grid grid-cols-3 gap-px mb-12"
        style={{ backgroundColor: "var(--border)" }}
      >
        {[
          { label: "Receitas", value: recipes.length },
          {
            label: "Esta semana",
            value: recipes.filter((r) => {
              const d = new Date();
              d.setDate(d.getDate() - 7);
              return r.createdAt > d;
            }).length,
          },
          { label: "Favoritas", value: 0 },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-6 text-center"
            style={{ backgroundColor: "var(--cream)" }}
          >
            <p className="font-display text-3xl mb-1">{stat.value}</p>
            <p
              className="text-xs tracking-wide uppercase"
              style={{ color: "var(--ink-muted)" }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-display text-2xl">Receitas recentes</h2>
        <Link
          href="/recipes/new"
          className="text-xs tracking-wide uppercase px-4 py-2 transition-colors"
          style={{
            backgroundColor: "var(--ink)",
            color: "var(--cream)",
          }}
        >
          + Nova receita
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div
          className="py-20 text-center border"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="font-display text-2xl italic mb-3"
            style={{ color: "var(--ink-muted)" }}
          >
            Nenhuma receita ainda
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>
            Comece adicionando sua primeira receita
          </p>
          <Link
            href="/recipes/new"
            className="text-sm underline underline-offset-4"
            style={{ color: "var(--accent)" }}
          >
            Criar receita
          </Link>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-px"
          style={{ backgroundColor: "var(--border)" }}
        >
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
              <div
                className="p-6 transition-colors hover:bg-white"
                style={{ backgroundColor: "var(--cream)" }}
              >
                <h3 className="font-display text-lg mb-2">{recipe.name}</h3>
                <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
                  {new Date(recipe.createdAt).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
