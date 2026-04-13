"use client"

import { ArrowDown, ShoppingBag, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 text-center lg:px-8">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Grabados Láser de Alta Precisión
        </p>
        
        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl text-balance">
          Precisión que define tu marca
        </h1>
        
        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Explorá nuestra colección de vasos, termos, mates y artículos de madera con grabados exclusivos. 
          Además, creá tu propio diseño personalizado con precios mayoristas para empresas.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="min-w-[200px] text-base gap-2">
            <ShoppingBag className="h-5 w-5" />
            Ver Productos
          </Button>
          <Button size="lg" variant="outline" className="min-w-[200px] text-base gap-2">
            <Sparkles className="h-5 w-5" />
            Personalizar (Mayorista)
          </Button>
        </div>

        {/* Info Tags */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 bg-card/50 backdrop-blur-sm">
            <span className="text-sm text-muted-foreground">Envío a todo el país</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 bg-card/50 backdrop-blur-sm">
            <span className="text-sm text-muted-foreground">Productos listos para enviar</span>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-foreground/30 px-4 py-2 bg-foreground/5 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-foreground animate-pulse" />
            <span className="text-sm text-foreground font-medium">
              Personalización mayorista desde 50 unidades
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
        <ArrowDown className="h-4 w-4 text-muted-foreground animate-bounce" />
      </div>
    </section>
  )
}
