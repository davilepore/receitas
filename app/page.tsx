import HeroBanner from "./_components/HeroBanner";
import Navbar from "./_components/Navbar";
import Sugestions from "./_components/Sugestions";
import MyRecipes from "./_components/MyRecipes";
import BottomNav from "./_components/BottomNav";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroBanner />
      <MyRecipes />
      <Sugestions />
      <BottomNav />
    </div>
  );
}
