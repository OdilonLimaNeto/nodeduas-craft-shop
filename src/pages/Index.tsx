import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CraftingProcess } from "@/components/CraftingProcess";
import { AboutFounders } from "@/components/AboutFounders";
import { SocialMedia } from "@/components/SocialMedia";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Footer } from "@/components/Footer";

const Index = () => {
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
};

export default Index;
