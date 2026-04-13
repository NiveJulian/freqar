import Link from "next/link";
import {
  Instagram,
  Linkedin,
  Mail,
  MessageCircleCodeIcon,
  MessageCirclePlus,
} from "lucide-react";

const navigation = {
  productos: [
    { name: "Vasos térmicos", href: "#" },
    { name: "Termos", href: "#" },
    { name: "Mates", href: "#" },
    { name: "Madera", href: "#" },
  ],
  empresa: [
    { name: "Nosotros", href: "nosotros" },
    { name: "Mayorista", href: "mayorista" },
    { name: "Contacto", href: "contacto" },
    { name: "Catálogo PDF", href: "#" },
  ],
  legal: [
    { name: "Términos y condiciones", href: "#" },
    { name: "Política de privacidad", href: "#" },
  ],
};

const social = [
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/freq.ar",
  },
  { name: "Whatsapp", icon: MessageCirclePlus, href: "#" },
  { name: "Email", icon: Mail, href: "mailto:ventas@freq.ar" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tighter text-foreground">
                FREQ<span className="text-muted-foreground">.AR</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Grabados láser de precisión para empresas. Transformamos objetos
              en piezas únicas que comunican tu marca.
            </p>

            {/* Social */}
            <div className="mt-6 flex gap-4">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="sr-only">{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Productos
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.productos.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Empresa
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.empresa.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* B2B Badge */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-foreground" />
              <span className="text-xs text-muted-foreground">
                Solo mayorista
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FREQ.AR. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Hecho con precisión en Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
