"use client";

import { useRouter } from "next/navigation";

export function DeleteButton({ recipeId }: { recipeId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Excluir esta receita?")) return;

    await fetch(`/api/recipes/${recipeId}`, { method: "DELETE" });
    router.push("/recipes");
  }

  return (
    <button
      onClick={handleDelete}
      className="px-6 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-200 transition-colors hover:bg-red-100"
    >
      Excluir
    </button>
  );
}
