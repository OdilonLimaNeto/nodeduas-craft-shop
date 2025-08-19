import { AboutFounders } from "@/components/AboutFounders";
import { CraftingProcess } from "@/components/CraftingProcess";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SocialMedia } from "@/components/SocialMedia";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <CraftingProcess />
        <AboutFounders />
        <SocialMedia />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}
