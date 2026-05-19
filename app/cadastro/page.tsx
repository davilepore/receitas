"use client";
import { useState } from "react";
import {
  ChefHat,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
} from "lucide-react";

import { useRouter } from "next/navigation";

function getStrength(password: string): {
  level: number;
  label: string;
  color: string;
} {
  let level = 0;
  if (password.length >= 6) level = 1;
  if (password.length >= 8) level = 2;
  if (password.length >= 10 && /[A-Z]/.test(password)) level = 3;
  if (password.length >= 12 && /[^a-zA-Z0-9]/.test(password)) level = 4;

  const map = [
    { label: "Força da senha", color: "bg-[#E8D5C4]" },
    { label: "Muito fraca", color: "bg-red-400" },
    { label: "Fraca", color: "bg-amber-400" },
    { label: "Boa", color: "bg-emerald-400" },
    { label: "Forte", color: "bg-[#C4622D]" },
  ];

  return { level, ...map[level] };
}

export default function CadastroScreen() {
  const router = useRouter();

  function onNavigateToLogin() {
    router.push("/login");
  }
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const strength = getStrength(password);
  const passwordsMatch = confirm.length > 0 && password === confirm;
  const passwordsMismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) return;
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName: name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error ?? "Erro ao criar conta. Tente novamente.");
        return;
      }

      router.push("/login");
    } catch {
      setErrorMessage("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F2] flex flex-col">
      <div className="bg-linear-to-br from-[#C4622D] via-[#7A4020]/80 to-[#3D2B1A] px-6 pt-14 pb-10 flex flex-col">
        <button
          onClick={onNavigateToLogin}
          className="self-start mb-4 text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Voltar</span>
        </button>
        <div className="flex items-center gap-2">
          <ChefHat size={28} className="text-white" />
          <span className="text-2xl font-bold tracking-tight text-white">
            Sabor<span className="text-[#FAC775]">IA</span>
          </span>
        </div>
        <p className="text-white/70 text-sm mt-1">Crie sua conta gratuita</p>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-6 pt-8 pb-10 shadow-lg">
        <h2 className="text-2xl font-bold text-[#3D2B1A] mb-1">Criar conta</h2>
        <p className="text-sm text-[#7A4020]/60 mb-7">
          Comece sua jornada culinária hoje
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#7A4020]/70 uppercase tracking-wide">
              Nome completo
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A4020]/40"
              />
              <input
                type="text"
                placeholder="Maria Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FAF6F2] text-[#3D2B1A] text-sm placeholder:text-[#7A4020]/30 focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] transition-all"
              />
            </div>
          </div>

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
                placeholder="Mínimo 8 caracteres"
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

            {password.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= strength.level ? strength.color : "bg-[#E8D5C4]"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#7A4020]/50">{strength.label}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#7A4020]/70 uppercase tracking-wide">
              Confirmar senha
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A4020]/40"
              />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repita sua senha"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full pl-9 pr-10 py-3 rounded-xl border bg-[#FAF6F2] text-[#3D2B1A] text-sm placeholder:text-[#7A4020]/30 focus:outline-none focus:ring-2 transition-all ${
                  passwordsMismatch
                    ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                    : passwordsMatch
                      ? "border-emerald-400 focus:ring-emerald-200 focus:border-emerald-400"
                      : "border-[#E8D5C4] focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A4020]/40 hover:text-[#C4622D] transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordsMismatch && (
              <p className="text-xs text-red-500">As senhas não coincidem</p>
            )}
            {passwordsMatch && (
              <p className="text-xs text-emerald-500">Senhas coincidem ✓</p>
            )}
          </div>

          <button
            type="submit"
            disabled={passwordsMismatch || password.length < 6}
            className="w-full py-3.5 rounded-xl bg-[#C4622D] hover:bg-[#7A4020] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-md shadow-[#C4622D]/20 mt-1"
          >
            Criar conta
          </button>
        </form>

        <p className="text-center text-xs text-[#7A4020]/40 mt-4 leading-relaxed">
          Ao criar uma conta, você concorda com nossos{" "}
          <button className="text-[#C4622D] hover:underline">
            Termos de Uso
          </button>{" "}
          e{" "}
          <button className="text-[#C4622D] hover:underline">
            Política de Privacidade
          </button>
        </p>

        <p className="text-center text-sm text-[#7A4020]/60 mt-4">
          Já tem conta?{" "}
          <button
            onClick={onNavigateToLogin}
            className="text-[#C4622D] font-semibold hover:text-[#7A4020] transition-colors"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
