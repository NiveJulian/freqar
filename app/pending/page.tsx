"use client"

import { Clock, Info, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function PendingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="rounded-full bg-amber-100 p-6 mb-8 animate-pulse">
          <Clock className="h-20 w-20 text-amber-600" />
        </div>
        
        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl mb-6">
          Pago Pendiente
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-xl mb-12 text-balance">
          Mercado Pago está procesando tu transacción. Esto puede demorar unos minutos dependiendo del medio de pago utilizado.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button asChild size="lg" className="rounded-full px-8 flex-1 bg-foreground text-background py-7 text-lg font-bold">
            <Link href="/">
              Ir al inicio
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 flex-1 py-7 text-lg font-bold">
            <Link href="/" className="flex items-center justify-center gap-2">
              Ver catálogo <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        <div className="mt-16 p-6 rounded-2xl bg-amber-50 border border-amber-100 max-w-lg">
          <Info className="h-8 w-8 text-amber-600 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2 text-amber-900">Aviso importante</h3>
          <p className="text-sm text-amber-800">
            Una vez que el pago sea acreditado, recibirás una confirmación automática y daremos inicio a la producción de tu pedido. No es necesario realizar ninguna otra acción.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
