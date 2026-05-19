import HeroBanner from "./_components/HeroBanner";
import Navbar from "./_components/Navbar";
import Sugestions from "./_components/Sugestions";
import MyRecipes from "./_components/MyRecipes";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroBanner />
      <MyRecipes />
      <Sugestions />
    </div>
  );
}
