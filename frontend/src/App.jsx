import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";
import IntroLoader from "./components/IntroLoader";
import ScrollToTop from "./components/ScrollToTop";
import { Suspense, lazy, useState, useEffect } from "react";
import AdminLayout from "./components/admin/AdminLayout";
import { api } from "./lib/api";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminContentPage = lazy(() => import("./pages/admin/AdminContentPage"));
const AdminAccountPage = lazy(() => import("./pages/admin/AdminAccountPage"));

// Dedicated Admin Modules
const AdminHome = lazy(() => import("./pages/admin/modules/AdminHome"));
const AdminAbout = lazy(() => import("./pages/admin/modules/AdminAbout"));
const AdminServices = lazy(() => import("./pages/admin/modules/AdminServices"));
const AdminProjects = lazy(() => import("./pages/admin/modules/AdminProjects"));
const AdminTestimonials = lazy(() => import("./pages/admin/modules/AdminTestimonials"));
const AdminGallery = lazy(() => import("./pages/admin/modules/AdminGallery"));
const AdminContact = lazy(() => import("./pages/admin/modules/AdminContact"));

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0A0F1C] z-[50]">
      <div className="loader-ring" />
    </div>
  );
}

export default function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(() => {
    // Check if intro has already played in this session
    return sessionStorage.getItem("introPlayed") === "true";
  });

  const handleIntroComplete = () => {
    setIsIntroComplete(true);
    sessionStorage.setItem("introPlayed", "true");
  };

  useEffect(() => {
    const reportVisit = async () => {
      // Only report visit if not already reported this session
      if (!sessionStorage.getItem("visitReported")) {
        try {
          await api.post("/stats/visit");
          sessionStorage.setItem("visitReported", "true");
        } catch (err) {
          console.warn("Failed to report visitor stats:", err);
        }
      }
    };
    reportVisit();
  }, []);

  return (
    <>
      {!isIntroComplete && <IntroLoader onComplete={handleIntroComplete} />}
      
      <div className={`transition-opacity duration-1000 ${isIntroComplete ? "opacity-100" : "opacity-0 invisible"}`}>
        <ScrollToTop />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route element={<Layout isIntroComplete={isIntroComplete} />}>
               <Route path="/" element={<HomePage isIntroComplete={isIntroComplete} />} />
               <Route path="/about" element={<AboutPage />} />
               <Route path="/services" element={<ServicesPage />} />
               <Route path="/projects" element={<ProjectsPage />} />
               <Route path="/testimonials" element={<TestimonialsPage />} />
               <Route path="/gallery" element={<GalleryPage />} />
               <Route path="/contact" element={<ContactPage />} />
               <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
               <Route path="/terms" element={<TermsPage />} />
            </Route>

            <Route path="/admin" element={<AdminLoginPage />} />
            
            {/* Protected Admin Suite with Layout */}
            <Route element={
              <AdminRoute>
                <AdminLayout>
                  <Outlet />
                </AdminLayout>
              </AdminRoute>
            }>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              
              {/* Specialized Modules */}
              <Route path="/admin/home" element={<AdminHome />} />
              <Route path="/admin/about" element={<AdminAbout />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/testimonials" element={<AdminTestimonials />} />
              <Route path="/admin/gallery" element={<AdminGallery />} />
              <Route path="/admin/contact" element={<AdminContact />} />

              {/* Generic/Special Pages */}
              <Route path="/admin/dashboard/:type" element={<AdminContentPage />} />
              <Route path="/admin/account" element={<AdminAccountPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}
