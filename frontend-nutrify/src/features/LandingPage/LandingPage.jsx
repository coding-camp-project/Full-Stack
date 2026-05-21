import Navbar from "./sections/Navbar"
import Hero from "./sections/Hero"
import Specialization from "./sections/Specialization"
import NutrifyFeatures from "./sections/NutrifyFeatures"
import WhyChoose from "./sections/WhyChoose"
import HowItWorks from "./sections/HowItWorks" 
import TeamSection from "./sections/TeamSection"
import FAQSection from "./sections/FAQSection"
import BlogSection from "./sections/BlogSection"
import Footer from "./sections/Footer"

function LandingPage() {
  return (
    <div className="min-w-0 overflow-x-clip">
      <Navbar />
      <Hero />
      <Specialization />
      <NutrifyFeatures />
      <WhyChoose />
      <HowItWorks />
      <TeamSection />
      <FAQSection />
      <BlogSection />
      <Footer />
    </div>
  )
}

export default LandingPage