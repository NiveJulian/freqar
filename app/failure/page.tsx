"use client"

import { XCircle, RefreshCcw, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function FailurePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="rounded-full bg-red-100 p-6 mb-8">
          <XCircle className="h-20 w-20 text-red-600" />
        </div>
        
        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl mb-6">
          Pago no completado
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-xl mb-12 text-balance">
          Lo sentimos, ha ocurrido un problema al procesar tu pago. No se ha realizado ningún cargo en tu cuenta.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button asChild size="lg" className="rounded-full px-8 flex-1 bg-red-600 hover:bg-red-700 text-white py-7 text-lg font-bold">
            <Link href="/checkout" className="flex items-center justify-center gap-2">
              <RefreshCcw className="h-5 w-5" /> Reintentar pago
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 flex-1 py-7 text-lg font-bold">
            <Link href="/" className="flex items-center justify-center gap-2">
              Volver al catálogo
            </Link>
          </Button>
        </div>
        
        <div className="mt-16 p-6 rounded-2xl bg-secondary/50 border border-border max-w-lg">
          <MessageSquare className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">¿Necesitas ayuda?</h3>
          <p className="text-sm text-muted-foreground">
            Si crees que esto es un error o necesitas asistencia personalizada, podés contactarnos por WhatsApp para finalizar tu compra de forma manual.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
