"use client";
import { useState } from "react";
import { ChefHat, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginScreen() {
  const router = useRouter();

  function onNavigateToCadastro() {
    router.push("/cadastro");
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error ?? "Erro ao fazer login. Tente novamente.");
        return;
      }

      router.push("/");
    } catch {
      setErrorMessage("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F2] flex flex-col">
      <div className="bg-linear-to-br from-[#C4622D] via-[#7A4020]/80 to-[#3D2B1A] px-6 pt-16 pb-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <ChefHat size={32} className="text-white" />
          <span className="text-3xl font-bold tracking-tight text-white">
            Sabor<span className="text-[#FAC775]">IA</span>
          </span>
        </div>
        <p className="text-white/70 text-sm">Receitas com inteligência</p>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-6 pt-8 pb-10 shadow-lg">
        <h2 className="text-2xl font-bold text-[#3D2B1A] mb-1">
          Bem-vindo de volta!
        </h2>
        <p className="text-sm text-[#7A4020]/60 mb-7">
          Entre com sua conta para continuar
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#7A4020]/70 uppercase tracking-wide">
              E-mail
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A4020]/40"
              />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FAF6F2] text-[#3D2B1A] text-sm placeholder:text-[#7A4020]/30 focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#7A4020]/70 uppercase tracking-wide">
              Senha
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A4020]/40"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-3 rounded-xl border border-[#E8D5C4] bg-[#FAF6F2] text-[#3D2B1A] text-sm placeholder:text-[#7A4020]/30 focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4020]/40 hover:text-[#C4622D] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="text-right">
              <button
                type="button"
                className="text-xs text-[#C4622D] hover:text-[#7A4020] transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#C4622D] hover:bg-[#7A4020] text-white font-semibold text-sm transition-colors shadow-md shadow-[#C4622D]/20 mt-1"
          >
            Entrar
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-[#E8D5C4]" />
            <span className="text-xs text-[#7A4020]/40">ou</span>
            <div className="flex-1 h-px bg-[#E8D5C4]" />
          </div>

          <button
            type="button"
            className="w-full py-3 rounded-xl border border-[#E8D5C4] bg-white hover:bg-[#FAF6F2] text-[#3D2B1A] font-medium text-sm flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </button>
        </form>

        <p className="text-center text-sm text-[#7A4020]/60 mt-7">
          Não tem conta?{" "}
          <button
            onClick={onNavigateToCadastro}
            className="text-[#C4622D] font-semibold hover:text-[#7A4020] transition-colors"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}
