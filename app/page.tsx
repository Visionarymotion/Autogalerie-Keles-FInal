import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import Inventory from '@/components/inventory'
import Services from '@/components/services'
import About from '@/components/about'
import Testimonials from '@/components/testimonials'
import Contact from '@/components/contact'
import MapSection from '@/components/map-section'
import Footer from '@/components/footer'

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Inventory />
      <Services />
      <About />
      <Testimonials />
      <Contact />
      <MapSection />
      <Footer />
    </main>
  )
}
