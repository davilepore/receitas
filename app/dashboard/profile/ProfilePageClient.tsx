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

export default function ProfilePageClient({ profile }: { profile: Profile }) {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [username, setUsername] = useState(profile.username ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [bannerUrl, setBannerUrl] = useState(profile.bannerUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

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
  }

  async function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, "banners");
    setBannerUrl(url);
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: profile.id,
        fullName,
        username,
        bio,
        avatarUrl,
        bannerUrl,
      }),
    });

    if (res.ok) {
      setMessage("Perfil salvo com sucesso.");
      router.refresh();
    } else {
      setMessage("Erro ao salvar. Tente novamente.");
    }

    setSaving(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1
        className="font-display text-3xl mb-10"
        style={{ color: "var(--ink)" }}
      >
        Editar perfil
      </h1>

      <div className="mb-6">
        <p
          className="text-xs tracking-wide uppercase mb-2"
          style={{ color: "var(--ink-muted)" }}
        >
          Banner
        </p>
        <div
          className="relative h-36 w-full overflow-hidden cursor-pointer group"
          style={{ backgroundColor: "var(--border)" }}
          onClick={() => bannerRef.current?.click()}
        >
          {bannerUrl && (
            <img
              src={bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          )}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: "rgba(26,24,22,0.4)" }}
          >
            <span className="text-xs text-white tracking-wide">
              Alterar banner
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
      </div>

      <div className="mb-10 flex items-end gap-4">
        <div>
          <p
            className="text-xs tracking-wide uppercase mb-2"
            style={{ color: "var(--ink-muted)" }}
          >
            Avatar
          </p>
          <div
            className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group"
            style={{ backgroundColor: "var(--border)" }}
            onClick={() => avatarRef.current?.click()}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span style={{ color: "var(--ink-muted)" }}>👤</span>
              </div>
            )}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: "rgba(26,24,22,0.4)" }}
            >
              <span className="text-xs text-white">✎</span>
            </div>
          </div>
          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <p className="text-xs pb-1" style={{ color: "var(--ink-muted)" }}>
          Clique para alterar a imagem
        </p>
      </div>

      <div className="space-y-5">
        {[
          {
            label: "Nome completo",
            value: fullName,
            setter: setFullName,
            placeholder: "Seu nome",
          },
          {
            label: "Nome de usuário",
            value: username,
            setter: setUsername,
            placeholder: "@usuario",
          },
        ].map((field) => (
          <div key={field.label}>
            <label
              className="block text-xs tracking-wide uppercase mb-1.5"
              style={{ color: "var(--ink-muted)" }}
            >
              {field.label}
            </label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 text-sm outline-none transition-colors"
              style={{
                backgroundColor: "white",
                border: "1px solid var(--border)",
                color: "var(--ink)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        ))}

        <div>
          <label
            className="block text-xs tracking-wide uppercase mb-1.5"
            style={{ color: "var(--ink-muted)" }}
          >
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Fale um pouco sobre você..."
            rows={3}
            className="w-full px-4 py-3 text-sm outline-none resize-none transition-colors"
            style={{
              backgroundColor: "white",
              border: "1px solid var(--border)",
              color: "var(--ink)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      </div>

      {message && (
        <p
          className="mt-4 text-xs py-2 px-3"
          style={{
            color: message.includes("Erro") ? "#c0392b" : "#276749",
            backgroundColor: message.includes("Erro") ? "#fdf0ef" : "#f0faf4",
            border: `1px solid ${message.includes("Erro") ? "#f5c6c2" : "#b7e4c7"}`,
          }}
        >
          {message}
        </p>
      )}

      <div className="mt-8 flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 text-sm tracking-wide transition-opacity"
          style={{
            backgroundColor: "var(--ink)",
            color: "var(--cream)",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Salvando..." : "Salvar perfil"}
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 text-sm transition-colors"
          style={{
            border: "1px solid var(--border)",
            color: "var(--ink-muted)",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
