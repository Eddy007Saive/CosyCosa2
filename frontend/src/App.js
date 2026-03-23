import { useEffect } from "react";
import "@/App.css";
import "@/i18n";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";

// Pages
import HomePage from "@/pages/HomePage";
import PropertiesPage from "@/pages/PropertiesPage";
import PropertyDetailPage from "@/pages/PropertyDetailPage";
import ContactPage from "@/pages/ContactPage";
import ConciergeriePage from "@/pages/ConciergeriePage";
import ProprietairesPage from "@/pages/ProprietairesPage";
import BlogPage from "@/pages/BlogPage";
import LegalPage from "@/pages/LegalPage";
import PrivacyPage from "@/pages/PrivacyPage";
import AdminPage from "@/pages/AdminPage";

// Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <HelmetProvider>
      <div className="App min-h-screen flex flex-col">
        <BrowserRouter>
          <Routes>
            {/* Admin route without Navbar/Footer */}
            <Route path="/admin" element={<AdminPage />} />
            
            {/* Public routes with Navbar/Footer */}
            <Route path="*" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/locations-vacances-cosy-casa" element={<PropertiesPage />} />
                    <Route path="/locations-vacances-cosy-casa/:id" element={<PropertyDetailPage />} />
                    <Route path="/conciergerie" element={<ConciergeriePage />} />
                    <Route path="/conciergerie-pour-proprietaires-corse" element={<ProprietairesPage />} />
                    <Route path="/conciergerie-cosy-casa-a-lecci" element={<BlogPage slug="lecci" />} />
                    <Route path="/conciergerie-cosy-casa-a-pinarello" element={<BlogPage slug="pinarello" />} />
                    <Route path="/conciergerie-cosy-casa-a-corse" element={<BlogPage slug="corse" />} />
                    <Route path="/contact-conciergerie-cosy-casa" element={<ContactPage />} />
                    <Route path="/legal" element={<LegalPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;
