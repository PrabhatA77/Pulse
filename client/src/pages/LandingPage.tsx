// client/src/pages/LandingPage.tsx
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="transition-all duration-300 min-h-screen flex flex-col dark:bg-[#0e1316]">
      <Navbar />
      <main className="flex-1">
        <div id="hero" className="scroll-mt-20">
          <Hero />
        </div>
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;