import { HeroSection } from "@/components/HeroSection";
import { LifestyleSection } from "@/components/LifestyleSection";
import { BismuthSeparator } from "@/components/BismuthGeometry";
import { ApplicationForm } from "@/components/ApplicationForm";
import { FloatingChat } from "@/components/FloatingChat";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <BismuthSeparator />
      <LifestyleSection />
      <BismuthSeparator />
      <ApplicationForm />
      <Footer />
      <FloatingChat />
      <ExitIntentPopup />
    </div>
  );
};

export default Index;
