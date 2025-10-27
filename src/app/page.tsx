import Image from "next/image";
import Hero from "@/components/custom/index/Hero";
import Header from "@/components/custom/index/Header";
import Features from "@/components/custom/index/Features";
import CattleTypes from "@/components/custom/index/CattleTypes";
import About from "@/components/custom/index/About";
import CallToAction from "@/components/custom/index/CallToAction";
import Footer from "@/components/custom/index/Footer";

export default function Home() {
  return (
      <div className="min-h-screen">
          <Header />
          <main>
              <Hero />
              <Features />
              <CattleTypes />
              <About />
              <CallToAction />
          </main>
          <Footer />
      </div>
  );
}
