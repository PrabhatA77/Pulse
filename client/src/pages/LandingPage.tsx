import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Footer from "../components/landing/Footer";
const LandingPage = () => {
  return (
    <div className="transition-all duration-300 min-h-screen flex flex-col dark:bg-[#0e1316]">
      <Navbar/>
      <main className="flex-1">
        <Hero/>
      </main>
      <Footer/>
    </div>
  )
}

export default LandingPage