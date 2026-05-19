"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()}>
      <ChevronLeft
        size={35}
        className="text-white mb-4 bg-white/15 border-white/25 p-2 rounded-full"
      />
    </button>
  );
}
