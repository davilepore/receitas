import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, fullName } = await request.json();

    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    const supabase = await createClient();


    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
      
        data: {
          username: username ?? null,
          full_name: fullName ?? null,
        },
      },
    });

    if (authError) {
      
      const errorMessages: Record<string, string> = {
        "User already registered": "Este e-mail já está cadastrado.",
        "Invalid email": "E-mail inválido.",
        "Password should be at least 6 characters":
          "A senha deve ter no mínimo 6 caracteres.",
      };

      const message =
        errorMessages[authError.message] ??
        "Erro ao criar conta. Tente novamente.";

      return NextResponse.json({ error: message }, { status: 400 });
    }

   
    return NextResponse.json(
      {
        message:
          "Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro.",
        user: {
          id: authData.user?.id,
          email: authData.user?.email,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}