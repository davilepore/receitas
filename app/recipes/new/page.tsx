"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, Plus, Trash2 } from "lucide-react";

const UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "xíc",
  "col.sopa",
  "col.chá",
  "un",
  "pitada",
  "a gosto",
];

type IngredientRow = {
  id: number;
  name: string;
  quantity: string;
  unity: string;
};

let nextId = 1;

function makeRow(): IngredientRow {
  return { id: nextId++, name: "", quantity: "", unity: "g" };
}

export default function NewRecipe() {
  const router = useRouter();

  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [timeToCook, setTimeToCook] = useState("");
  const [ingredients, setIngredients] = useState<IngredientRow[]>([makeRow()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addIngredient() {
    setIngredients((prev) => [...prev, makeRow()]);
  }

  function removeIngredient(id: number) {
    if (ingredients.length === 1) return;
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }

  function updateIngredient(
    id: number,
    field: keyof IngredientRow,
    value: string,
  ) {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!recipeName.trim()) {
      setError("Informe o nome da receita.");
      return;
    }
    if (!timeToCook || isNaN(Number(timeToCook))) {
      setError("Informe um tempo de preparo válido.");
      return;
    }
    const validIngredients = ingredients.filter((i) => i.name.trim());
    if (validIngredients.length === 0) {
      setError("Adicione pelo menos um ingrediente.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: recipeName.trim(),
        description: description.trim(),
        timeToCook: Number(timeToCook),
        ingredients: validIngredients.map((i) => ({
          name: i.name.trim(),
          quantity: i.quantity.trim(),
          unity: i.unity,
        })),
      }),
    });

    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      router.push(`/recipes/${data.id}`);
    } else {
      setError("Erro ao criar receita. Tente novamente.");
    }
  }

  const inputClass =
    "w-full pl-3 pr-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FAF6F2] text-[#3D2B1A] text-sm placeholder:text-[#7A4020]/30 focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] transition-all";

  const labelClass =
    "text-xs font-semibold text-[#7A4020]/70 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-[#FAF6F2] flex flex-col">
      <div className="bg-gradient-to-br from-[#C4622D] via-[#7A4020]/80 to-[#3D2B1A] px-6 pt-16 pb-10 flex flex-col items-center">
        <ChefHat size={32} className="text-white mb-2" />
        <span className="text-3xl font-bold tracking-tight text-white">
          Crie a <span className="text-[#FAC775]">SUA</span> receita
        </span>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-6 pt-8 pb-10 shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Nome da receita</label>
            <input
              className={inputClass}
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder="Ex: Bolo de cenoura da vovó"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Descrição</label>
            <textarea
              className={inputClass}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva brevemente sua receita..."
              style={{ resize: "none" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Tempo de preparo (minutos)</label>
            <input
              className={inputClass}
              type="number"
              min={1}
              value={timeToCook}
              onChange={(e) => setTimeToCook(e.target.value)}
              placeholder="Ex: 45"
              style={{ maxWidth: 160 }}
            />
          </div>

          <div className="border-t border-[#E8D5C4]" />

          <div className="flex flex-col gap-3">
            <label className={labelClass}>Ingredientes</label>

            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: "1fr 72px 90px 36px" }}
            >
              {["Ingrediente", "Qtd", "Unidade", ""].map((h) => (
                <span
                  key={h}
                  className="text-[10px] font-semibold text-[#7A4020]/60 uppercase tracking-wide"
                >
                  {h}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {ingredients.map((ing) => (
                <div
                  key={ing.id}
                  className="grid gap-2 items-center"
                  style={{ gridTemplateColumns: "1fr 72px 90px 36px" }}
                >
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) =>
                      updateIngredient(ing.id, "name", e.target.value)
                    }
                    placeholder="Farinha de trigo"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8D5C4] bg-[#FAF6F2] text-[#3D2B1A] text-sm placeholder:text-[#7A4020]/30 focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] transition-all"
                  />

                  <input
                    type="text"
                    value={ing.quantity}
                    onChange={(e) =>
                      updateIngredient(ing.id, "quantity", e.target.value)
                    }
                    placeholder="2"
                    className="w-full px-2 py-2.5 rounded-xl border border-[#E8D5C4] bg-[#FAF6F2] text-[#3D2B1A] text-sm text-center placeholder:text-[#7A4020]/30 focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] transition-all"
                  />

                  <select
                    value={ing.unity}
                    onChange={(e) =>
                      updateIngredient(ing.id, "unity", e.target.value)
                    }
                    className="w-full px-2 py-2.5 rounded-xl border border-[#E8D5C4] bg-[#FAF6F2] text-[#3D2B1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] transition-all appearance-none cursor-pointer"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => removeIngredient(ing.id)}
                    disabled={ingredients.length === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E8D5C4] bg-[#FAF6F2] text-[#C4622D] transition-colors hover:bg-[#FAF0E8] disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Remover ingrediente"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed border-[#E8D5C4] text-[#C4622D] text-sm font-semibold transition-colors hover:bg-[#FAF6F2] hover:border-[#C4622D]"
            >
              <Plus size={16} />
              Adicionar ingrediente
            </button>
          </div>

          {ingredients.some((i) => i.name.trim()) && (
            <div className="bg-[#FAF6F2] rounded-xl p-4 border border-[#E8D5C4]">
              <p className="text-[10px] font-semibold text-[#7A4020]/60 uppercase tracking-wide mb-2">
                Resumo
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ingredients
                  .filter((i) => i.name.trim())
                  .map((i) => (
                    <span
                      key={i.id}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#E8D5C4] text-[#3D2B1A] text-xs"
                    >
                      {i.quantity && `${i.quantity} ${i.unity} `}
                      {i.name}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#C4622D] hover:bg-[#7A4020] disabled:opacity-60 text-white font-semibold text-sm transition-colors shadow-md shadow-[#C4622D]/20"
          >
            {loading ? "Criando..." : "Criar Receita"}
          </button>
        </form>
      </div>
    </div>
  );
}
