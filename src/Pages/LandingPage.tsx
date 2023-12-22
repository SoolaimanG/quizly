import { useQuery } from "@tanstack/react-query";
import { getUser } from "../Functions/APIqueries";
import Navbar from "../components/App/navbar";
import ContactUs from "./Comps/ContactUs";
import Features from "./Comps/Features";
import Footer from "./Comps/Footer";
import Hero from "./Comps/Hero";
import Reviews from "./Comps/Reviews";
import Services from "./Comps/Services";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { useZStore } from "../provider";
import { IUser } from "../Types/components.types";

const LandingPage = () => {
  useDocumentTitle("Quizly | Landing Page");
  const { setUser } = useZStore();
  const { data, error } = useQuery<string, any, { data: IUser }>({
    queryKey: ["user"],
    queryFn: () => getUser(),
    retry: 1,
  });

  useEffect(() => {
    !error && setUser(data?.data as IUser);
  }, [data]);

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
