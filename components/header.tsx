"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";

import Image from "next/image";

const navigation = [
  { name: "Productos", href: "#productos" },
  { name: "Personalizar", href: "#personalizador", badge: "Mayorista" },
  { name: "Nosotros", href: "#nosotros" },
  { name: "Contacto", href: "#contacto" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const [logoState, setLogoState] = useState(0); // 0: FREQ.AR, 1: FRECUENCIA, 2: LOGO ONLY

  useEffect(() => {
    const timer = setInterval(() => {
      setLogoState((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center min-w-[150px]">
          <span className="text-xl sm:text-2xl font-black tracking-tighter text-foreground">
            FRE
          </span>
          <div className="relative flex items-center">
            {logoState === 0 && (
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-foreground animate-in fade-in slide-in-from-left-1 duration-500">
                Q<span className="text-muted-foreground">.AR</span>
              </span>
            )}

            {logoState === 1 && (
              <div className="flex items-center animate-in fade-in slide-in-from-left-1 duration-500">
                <span className="text-xl sm:text-2xl font-black tracking-tighter text-foreground">
                  C
                </span>
                <div className="relative h-5 w-5 sm:h-7 sm:w-7 mx-0.5">
                  <Image
                    src="/freq.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-xl sm:text-2xl font-black tracking-tighter text-foreground">
                  ENCIA
                </span>
              </div>
            )}

            {logoState === 2 && (
              <div className="flex items-center animate-in fade-in slide-in-from-left-1 duration-500">
                <span className="text-xl sm:text-2xl font-black tracking-tighter text-foreground">
                  Q
                </span>
                <div className="relative h-5 w-5 sm:h-7 sm:w-7 mx-4">
                  <Image
                    src="/freq.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
              {item.badge && (
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 px-1.5 border-foreground/30"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>
        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
              {totalItems}
            </span>
            <span className="sr-only">Carrito</span>
          </Button>
          <Button size="sm" className="hidden lg:flex" asChild>
            <Link href="#contacto">Contactar</Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full bg-background">
              <div className="flex flex-col gap-6 pt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-lg font-medium text-foreground"
                  >
                    {item.name}
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className="text-xs border-foreground/30"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 pt-4">
                  <Button asChild>
                    <Link href="#contacto" onClick={() => setIsOpen(false)}>
                      Contactar
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
