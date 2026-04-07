import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ProjectsSection from "@/components/ProjectsSection";
import EducationSection from "@/components/EducationSection";
import CertificatesSection from "@/components/CertificatesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ColorSwitcher from "@/components/ColorSwitcher";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ColorSwitcher />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ProjectsSection />
      <EducationSection />
      <CertificatesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
