import HeroSection from '@/components/HeroSection';
import ProductCatalog from '@/components/ProductCatalog';
import WhyChooseUs from '@/components/WhyChooseUs';
import PriceCalculator from '@/components/PriceCalculator';
import AboutFounder from '@/components/AboutFounder';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductCatalog />
      <WhyChooseUs />
      <PriceCalculator />
      <AboutFounder />
      <Footer />
    </>
  );
}
