import { HeroSection } from "@/components/HeroSection";
import { LifestyleSection } from "@/components/LifestyleSection";
import { BismuthSeparator } from "@/components/BismuthGeometry";
import { ApplicationForm } from "@/components/ApplicationForm";
import { FloatingChat } from "@/components/FloatingChat";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div id="hero">
        <HeroSection />
      </div>
      <ApplicationForm />
      <BismuthSeparator />
      <LifestyleSection />
      <div id="contact">
        <Footer />
      </div>
      <FloatingChat />
      <ExitIntentPopup />
    </div>
  );
};

export default Index;
