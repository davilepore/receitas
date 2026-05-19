"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Profile = {
  id: string;
  fullName: string | null;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
};

type Tab = "perfil" | "conta" | "notificacoes" | "privacidade";

const TABS: { key: Tab; label: string }[] = [
  { key: "perfil", label: "Perfil" },
  { key: "conta", label: "Conta" },
  { key: "notificacoes", label: "Notificações" },
  { key: "privacidade", label: "Privacidade" },
];

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        className="block text-xs tracking-widest uppercase mb-1.5"
        style={{ color: "var(--ink-muted)" }}
      >
        {label}
      </label>
      <input
        className="w-full px-4 py-3 text-sm outline-none"
        style={{
          backgroundColor: "white",
          border: "1px solid var(--border)",
          color: "var(--ink)",
          fontFamily: "inherit",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        {...props}
      />
    </div>
  );
}

function Toggle({
  label,
  description,
  defaultOn = false,
}: {
  label: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div>
        <p
          className="text-sm font-medium mb-0.5"
          style={{ color: "var(--ink)" }}
        >
          {label}
        </p>
        <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
          {description}
        </p>
      </div>
      <button
        onClick={() => setOn(!on)}
        role="switch"
        aria-checked={on}
        className="relative flex-shrink-0 transition-colors"
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          backgroundColor: on ? "var(--accent)" : "var(--border)",
        }}
      >
        <span
          className="absolute top-[3px] transition-transform"
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "white",
            left: 3,
            transform: on ? "translateX(16px)" : "translateX(0)",
          }}
        />
      </button>
    </div>
  );
}

export default function SettingsClient({
  profile,
  userEmail,
}: {
  profile: Profile;
  userEmail: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>("perfil");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [username, setUsername] = useState(profile.username ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [bannerUrl, setBannerUrl] = useState(profile.bannerUrl ?? "");

  const [email, setEmail] = useState(userEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  async function uploadImage(file: File, bucket: "avatars" | "banners") {
    const ext = file.name.split(".").pop();
    const path = `${profile.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, "avatars");
    setAvatarUrl(url);
    showToast("Avatar atualizado");
  }

  async function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, "banners");
    setBannerUrl(url);
    showToast("Banner atualizado");
  }

  async function saveProfile() {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        username,
        bio,
        avatarUrl,
        bannerUrl,
      }),
    });
    setSaving(false);
    if (res.ok) {
      showToast("Perfil salvo com sucesso");
      router.refresh();
    } else showToast("Erro ao salvar");
  }

  async function saveAccount() {
    if (newPassword && newPassword !== confirmPassword) {
      showToast("As senhas não coincidem");
      return;
    }
    setSaving(true);
    if (email !== userEmail) await supabase.auth.updateUser({ email });
    if (newPassword) await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    showToast("Conta atualizada");
  }

  const style = {
    cream: { backgroundColor: "var(--cream)" } as React.CSSProperties,
    ink: { color: "var(--ink)" } as React.CSSProperties,
    muted: { color: "var(--ink-muted)" } as React.CSSProperties,
    border: { borderColor: "var(--border)" } as React.CSSProperties,
  };

  return (
    <div
      className="max-w-2xl mx-auto px-6 py-12"
      style={{ position: "relative" }}
    >
      <div className="flex items-baseline gap-3 mb-8">
        <span
          className="font-display text-2xl italic"
          style={{ color: "var(--accent)" }}
        >
          Receitas
        </span>
        <span style={style.muted}>/</span>
        <span className="text-sm" style={style.muted}>
          Configurações
        </span>
      </div>

      <div className="flex border-b mb-8" style={style.border}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-5 py-3 text-sm transition-colors"
            style={{
              borderBottom:
                tab === t.key
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
              color: tab === t.key ? "var(--ink)" : "var(--ink-muted)",
              fontWeight: tab === t.key ? 500 : 300,
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "perfil" && (
        <div>
          <div
            className="relative h-28 w-full overflow-hidden cursor-pointer group mb-6"
            style={{ backgroundColor: "var(--border)" }}
            onClick={() => bannerRef.current?.click()}
          >
            {bannerUrl && (
              <img
                src={bannerUrl}
                className="w-full h-full object-cover"
                alt=""
              />
            )}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: "rgba(26,24,22,0.4)" }}
            >
              <span className="text-xs tracking-widest uppercase text-white">
                ↑ Alterar banner
              </span>
            </div>
          </div>
          <input
            ref={bannerRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerChange}
          />

          <div className="flex items-end gap-4 mb-8">
            <div
              className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer group flex-shrink-0"
              style={{ backgroundColor: "var(--border)" }}
              onClick={() => avatarRef.current?.click()}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center font-display italic text-xl"
                  style={{ color: "var(--accent)" }}
                >
                  {fullName?.[0] ?? "U"}
                </div>
              )}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: "rgba(26,24,22,0.4)" }}
              >
                <span className="text-white text-xs">✎</span>
              </div>
            </div>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div>
              <p className="text-sm font-medium" style={style.ink}>
                {fullName || "Seu nome"}
              </p>
              <p className="text-xs" style={style.muted}>
                {username ? `@${username.replace("@", "")}` : "@usuario"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              label="Nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome"
            />
            <Input
              label="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@usuario"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-xs tracking-widest uppercase mb-1.5"
              style={style.muted}
            >
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Fale sobre você..."
              className="w-full px-4 py-3 text-sm outline-none resize-none"
              style={{
                backgroundColor: "white",
                border: "1px solid var(--border)",
                color: "var(--ink)",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <Input
            label="Localização"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Cidade, Estado"
          />

          <SaveBar
            onSave={saveProfile}
            onCancel={() => router.back()}
            saving={saving}
          />
        </div>
      )}

      {tab === "conta" && (
        <div>
          <p className="text-sm mb-6" style={style.muted}>
            Informações de acesso
          </p>

          <div className="mb-4">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nova senha"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="Confirmar senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <SaveBar onSave={saveAccount} saving={saving} label="Atualizar" />

          <div
            className="mt-8 p-5"
            style={{ border: "1px solid var(--border)" }}
          >
            <span
              className="block text-xs tracking-widest uppercase mb-3"
              style={{ color: "#c0392b" }}
            >
              Zona de perigo
            </span>
            <p className="text-xs mb-4" style={style.muted}>
              Esta ação é permanente e não pode ser desfeita.
            </p>
            <button
              className="text-xs px-4 py-2 transition-colors"
              style={{
                border: "1px solid #c0392b",
                color: "#c0392b",
                background: "transparent",
              }}
              onClick={() => showToast("Confirme por e-mail para excluir")}
            >
              Excluir conta
            </button>
          </div>
        </div>
      )}

      {tab === "notificacoes" && (
        <div>
          <p className="text-sm mb-6" style={style.muted}>
            Escolha quando e como ser notificado
          </p>
          <Toggle
            label="Novas receitas em destaque"
            description="Receba por e-mail quando houver novidades"
            defaultOn
          />
          <Toggle
            label="Comentários nas suas receitas"
            description="Notificação quando alguém comentar"
            defaultOn
          />
          <Toggle
            label="Newsletter semanal"
            description="Resumo das melhores receitas da semana"
          />
          <Toggle
            label="Favoritos atualizados"
            description="Quando uma receita favoritada for editada"
            defaultOn
          />
          <SaveBar
            onSave={() => showToast("Preferências salvas")}
            saving={false}
            label="Salvar preferências"
          />
        </div>
      )}

      {/* PRIVACIDADE */}
      {tab === "privacidade" && (
        <div>
          <p className="text-sm mb-6" style={style.muted}>
            Controle quem pode ver o quê
          </p>
          <Toggle
            label="Perfil público"
            description="Qualquer pessoa pode ver seu perfil"
            defaultOn
          />
          <Toggle
            label="Receitas visíveis por padrão"
            description="Novas receitas serão públicas ao criar"
            defaultOn
          />
          <Toggle
            label="Mostrar localização no perfil"
            description="Exibir cidade e estado para visitantes"
          />
          <SaveBar
            onSave={() => showToast("Configurações salvas")}
            saving={false}
          />
        </div>
      )}

      {toast && (
        <div
          className="fixed bottom-6 right-6 px-5 py-3 text-xs tracking-wide"
          style={{
            backgroundColor: "var(--ink)",
            color: "var(--cream)",
            zIndex: 50,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function SaveBar({
  onSave,
  onCancel,
  saving,
  label = "Salvar",
}: {
  onSave: () => void;
  onCancel?: () => void;
  saving: boolean;
  label?: string;
}) {
  return (
    <div
      className="flex gap-3 mt-8 pt-6"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <button
        onClick={onSave}
        disabled={saving}
        className="px-6 py-3 text-xs tracking-widest uppercase transition-opacity"
        style={{
          backgroundColor: "var(--ink)",
          color: "var(--cream)",
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? "Salvando..." : label}
      </button>
      {onCancel && (
        <button
          onClick={onCancel}
          className="px-6 py-3 text-xs"
          style={{
            border: "1px solid var(--border)",
            color: "var(--ink-muted)",
          }}
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
