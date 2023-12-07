import { useMethods } from "../Hooks";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/App/navbar";
import ContactUs from "./Comps/ContactUs";
import Features from "./Comps/Features";
import Footer from "./Comps/Footer";
import Hero from "./Comps/Hero";
import Reviews from "./Comps/Reviews";
import Services from "./Comps/Services";
import { useDocumentTitle } from "@uidotdev/usehooks";

const LandingPage = () => {
  useDocumentTitle("Quizly | Landing Page");
  const { get_user } = useMethods();
  useQuery({ queryKey: ["user_data"], queryFn: get_user, retry: 3 });

  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <Reviews />
      <Features />
      <ContactUs />
      <Footer />
    </main>
  );
};

export default LandingPage;
