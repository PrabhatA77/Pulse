// client/src/pages/LandingPage.tsx
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";
import LanguagesShowcase from "../components/landing/LanguageShowcase";


const LandingPage = () => {
  return (
    <div className="transition-all duration-300 min-h-screen flex flex-col dark:bg-[#0e1316]">
      <Navbar />
      <main className="flex-1">
        <div id="hero" className="flex min-h-[calc(100vh-3.5rem)] scroll-mt-20 items-center">
          <Hero />
        </div>
        <LanguagesShowcase />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;