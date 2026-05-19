// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { fullName, username, bio, avatarUrl, bannerUrl } = await req.json();

  const profile = await prisma.profile.update({
    where: { id: user.id },
    data: {
      fullName: fullName ?? undefined,
      username: username ?? undefined,
      bio: bio ?? undefined,
      avatarUrl: avatarUrl ?? undefined,
      bannerUrl: bannerUrl ?? undefined,
    },
  });

  return NextResponse.json(profile);
}