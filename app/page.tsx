import HeroBanner from "./_components/HeroBanner";
import Navbar from "./_components/Navbar";
import Sugestions from "./_components/Sugestions";
import MyRecipes from "./_components/MyRecipes";
import BottomNav from "./_components/BottomNav";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = await prisma.profile.findUnique({ where: { id: user!.id } });
  return (
    <div>
      <Navbar profile={profile} />
      <HeroBanner />
      <MyRecipes />
      <Sugestions />
      <BottomNav />
    </div>
  );
}
