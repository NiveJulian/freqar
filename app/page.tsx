import { Header } from "@/components/header";
import { TermoArgentinaPromo } from "@/components/termo-argentina-promo";
import { Products } from "@/components/products";
import { Customizer } from "@/components/customizer";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <TermoArgentinaPromo />
      <Products />
      {/* <Customizer /> */}
      {/* <About /> */}
      {/* <Contact /> */}
      <Footer />
    </main>
  );
}
