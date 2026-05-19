import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const errorMessages: Record<string, string> = {
        "Invalid login credentials": "E-mail ou senha incorretos.",
        "Email not confirmed":
          "Confirme seu e-mail antes de fazer login.",
      };

      const message =
        errorMessages[error.message] ?? "Erro ao fazer login. Tente novamente.";

      return NextResponse.json({ error: message }, { status: 401 });
    }

    return NextResponse.json(
      {
        message: "Login realizado com sucesso!",
        user: {
          id: data.user.id,
          email: data.user.email,
        },
       
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}