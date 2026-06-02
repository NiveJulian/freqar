"use client";

import { use } from "react";
import Link from "next/link";
import { petOwners, getWhatsAppLink } from "@/lib/links-config";
import { MessageSquare, Phone, User, Bone, Cat, Heart, ShieldAlert, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ id: string }>;
}

export default function PetOwnerLinkPage({ params }: Props) {
  const { id } = use(params);

  // Buscar la mascota por id (que actúa como slug de URL)
  const pet = petOwners.find(
    (owner) => owner.id.toLowerCase() === id.toLowerCase()
  );

  // Si no se encuentra la mascota, mostrar pantalla de error premium
  if (!pet) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-6">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="relative z-10 max-w-md w-full text-center space-y-6 bg-card/40 border border-border p-8 rounded-2xl backdrop-blur-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20 text-destructive animate-pulse">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black font-heading tracking-tight text-foreground">
            Mascota no encontrada
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Lo sentimos, el enlace escaneado no corresponde a ninguna mascota registrada en nuestro sistema de chapitas FREQ.AR.
          </p>
          <div className="pt-4">
            <Button asChild className="w-full rounded-xl cursor-pointer">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" /> Volver al Inicio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const whatsAppLink = getWhatsAppLink(pet.phone, pet.message);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <header className="relative z-10 max-w-md mx-auto w-full flex justify-between items-center py-4">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold tracking-tighter text-foreground">
            FREQ<span className="text-muted-foreground">.AR</span>
          </span>
        </Link>
        <Badge variant="outline" className="text-[10px] uppercase font-bold py-0.5 px-2 border-foreground/30">
          Chapa Grabada Láser
        </Badge>
      </header>

      {/* Main card */}
      <main className="relative z-10 max-w-md w-full mx-auto my-auto py-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/30 p-8 backdrop-blur-xl shadow-2xl shadow-emerald-500/5">
          {/* Top subtle green glow aura */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            
            {/* Status alert badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 px-3 py-1 bg-emerald-500/10 text-xs font-bold text-emerald-400 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              CONTACTAR PROPIETARIO
            </div>

            {/* Pet Icon Holder */}
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-card border border-border text-foreground shadow-inner">
              {pet.petType === 'dog' && <Bone className="h-12 w-12 text-muted-foreground" />}
              {pet.petType === 'cat' && <Cat className="h-12 w-12 text-muted-foreground" />}
              {pet.petType === 'other' && <Heart className="h-12 w-12 text-muted-foreground" />}
            </div>

            {/* Pet & Breed Info */}
            <div className="space-y-1">
              <h1 className="text-5xl font-black font-heading tracking-tight text-foreground">
                {pet.petName}
              </h1>
              {pet.petBreed && (
                <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                  {pet.petBreed}
                </p>
              )}
            </div>

            {/* Owner contact details card */}
            <div className="w-full rounded-2xl bg-card/60 p-4 border border-border/40 text-left space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Dueño de la Mascota</p>
                  <p className="text-sm font-semibold text-foreground">{pet.ownerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Teléfono de Contacto</p>
                  <p className="text-sm font-semibold text-foreground font-mono">+{pet.phone}</p>
                </div>
              </div>
            </div>

            {/* Helpful message for finder */}
            <div className="text-xs text-muted-foreground leading-relaxed px-2 w-full text-center">
              Al hacer clic abajo, se abrirá WhatsApp con el mensaje:
              <span className="block mt-1.5 font-medium italic text-foreground bg-card/40 border border-border/20 p-3 rounded-xl text-[11px] leading-normal">
                "{pet.message}"
              </span>
            </div>

            {/* Giant WhatsApp Button */}
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-emerald-500 px-6 py-4 text-base font-black text-black transition-all duration-300 hover:scale-[1.03] hover:bg-emerald-400 active:scale-[0.98] shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <MessageSquare className="h-5 w-5 fill-black" />
              Enviar WhatsApp al Dueño
            </a>

          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 max-w-md mx-auto w-full text-center py-4 space-y-1">
        <p className="text-[10px] text-muted-foreground">
          Identificación provista por <Link href="/" className="font-bold text-foreground hover:underline">FREQ.AR</Link>
        </p>
        <p className="text-[9px] text-muted-foreground/60">
          Grabados láser de precisión • Buenos Aires, Argentina
        </p>
      </footer>
    </div>
  );
}
