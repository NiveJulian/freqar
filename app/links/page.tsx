"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { petOwners, getWhatsAppLink } from "@/lib/links-config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Phone, User, Bone, Cat, Heart, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LinksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'dog' | 'cat' | 'other'>('all');

  const filteredOwners = petOwners.filter((owner) => {
    const matchesSearch =
      owner.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (owner.petBreed && owner.petBreed.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = activeFilter === 'all' || owner.petType === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Hero Section of Links */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-foreground/30 px-3 py-1 bg-foreground/5 backdrop-blur-sm text-xs font-semibold text-foreground uppercase tracking-wider mb-2 animate-in fade-in slide-in-from-top-4 duration-500">
            <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
            FREQ.AR Mascotas
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground font-heading">
            Contacto de Propietarios
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
            Si encontraste una mascota perdida que lleva una de nuestras chapitas grabadas láser, 
            busca su nombre aquí abajo y contáctate inmediatamente con su dueño vía WhatsApp.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre de mascota, dueño o raza..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-base bg-card/50 backdrop-blur-sm border-border focus:border-foreground/50 transition-all rounded-xl w-full"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={activeFilter === 'all' ? "default" : "outline"}
              onClick={() => setActiveFilter('all')}
              className="rounded-full px-6 py-2 transition-all cursor-pointer"
            >
              Todos
            </Button>
            <Button
              variant={activeFilter === 'dog' ? "default" : "outline"}
              onClick={() => setActiveFilter('dog')}
              className="rounded-full px-6 py-2 gap-2 transition-all cursor-pointer"
            >
              <Bone className="h-4 w-4" />
              Perros
            </Button>
            <Button
              variant={activeFilter === 'cat' ? "default" : "outline"}
              onClick={() => setActiveFilter('cat')}
              className="rounded-full px-6 py-2 gap-2 transition-all cursor-pointer"
            >
              <Cat className="h-4 w-4" />
              Gatos
            </Button>
            <Button
              variant={activeFilter === 'other' ? "default" : "outline"}
              onClick={() => setActiveFilter('other')}
              className="rounded-full px-6 py-2 transition-all cursor-pointer"
            >
              Otros
            </Button>
          </div>
        </div>

        {/* Results Grid */}
        {filteredOwners.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {filteredOwners.map((owner) => (
              <a
                key={owner.id}
                href={getWhatsAppLink(owner.phone, owner.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-foreground/30 hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.99] cursor-pointer"
              >
                {/* Glowing Aura Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="relative z-10 space-y-4">
                  {/* Top Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tight text-foreground font-heading">
                          {owner.petName}
                        </span>
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold py-0 px-2 tracking-wider">
                          {owner.petType === 'dog' ? 'Perro' : owner.petType === 'cat' ? 'Gato' : 'Mascota'}
                        </Badge>
                      </div>
                      {owner.petBreed && (
                        <p className="text-xs text-muted-foreground font-medium">
                          {owner.petBreed}
                        </p>
                      )}
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-muted-foreground group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-300">
                      {owner.petType === 'dog' && <Bone className="h-5 w-5" />}
                      {owner.petType === 'cat' && <Cat className="h-5 w-5" />}
                      {owner.petType === 'other' && <Heart className="h-5 w-5" />}
                    </div>
                  </div>

                  {/* Owner Info Details */}
                  <div className="pt-4 border-t border-border/40 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                      <span>Dueño: <strong className="text-foreground font-semibold">{owner.ownerName}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                      <span>Teléfono: <span className="font-mono text-xs">+{owner.phone}</span></span>
                    </div>
                  </div>

                  {/* Sample Message Box */}
                  <div className="rounded-lg bg-card/60 p-3 border border-border/20 text-xs text-muted-foreground italic leading-relaxed">
                    "{owner.message}"
                  </div>
                </div>

                {/* Card CTA Link Action */}
                <div className="relative z-10 mt-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-black transition-colors duration-300 group-hover:bg-emerald-400">
                  <MessageSquare className="h-4 w-4" />
                  Contactar por WhatsApp
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center max-w-md mx-auto py-16 space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border text-muted-foreground">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No se encontraron mascotas</h3>
            <p className="text-sm text-muted-foreground">
              Intenta buscar por otro nombre o limpia los filtros de búsqueda para ver a todos los dueños de mascotas registrados.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter('all');
              }}
              className="mt-2"
            >
              Restablecer filtros
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
