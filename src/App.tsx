import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import Index from "./pages/Index";
import About from "./pages/About";
import Specialties from "./pages/Specialties";
import Testimonials from "./pages/Testimonials";
import Appointments from "./pages/Appointments";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import PostEditor from "./pages/admin/PostEditor";
import AdminLocations from "./pages/admin/AdminLocations";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminServices from "./pages/admin/AdminServices";
import AdminComments from "./pages/admin/AdminComments";
import AdminAppointments from "./pages/admin/AdminAppointments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Analytics wrapper component
function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  usePageAnalytics();
  return <>{children}</>;
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnalyticsWrapper>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/specialties" element={<Specialties />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                {/* Hidden Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/posts" element={<AdminPosts />} />
                <Route path="/admin/posts/new" element={<PostEditor />} />
                <Route path="/admin/posts/:id" element={<PostEditor />} />
                <Route path="/admin/locations" element={<AdminLocations />} />
                <Route path="/admin/services" element={<AdminServices />} />
                <Route path="/admin/testimonials" element={<AdminTestimonials />} />
                <Route path="/admin/comments" element={<AdminComments />} />
                <Route path="/admin/appointments" element={<AdminAppointments />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnalyticsWrapper>
          </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
