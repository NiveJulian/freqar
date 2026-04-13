"use client"

import { useEffect } from "react"
import { CheckCircle2, ArrowRight, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"

export default function SuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20" />
          <div className="relative rounded-full bg-green-100 p-6">
            <CheckCircle2 className="h-20 w-20 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl mb-6">
          ¡Pago Confirmado!
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-xl mb-12 text-balance">
          Muchas gracias por tu confianza. Tu pedido ha sido procesado correctamente y ya estamos preparando todo el grabado láser para que quede perfecto.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button asChild size="lg" className="rounded-full px-8 flex-1 bg-foreground text-background hover:bg-foreground/90 py-7 text-lg font-bold">
            <Link href="/">
              Seguir comprando
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 flex-1 py-7 text-lg font-bold">
            <Link href="/" className="flex items-center justify-center gap-2">
              Ir al inicio <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        <div className="mt-16 p-6 rounded-2xl bg-secondary/50 border border-border max-w-lg">
          <PartyPopper className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">¿Qué sigue ahora?</h3>
          <p className="text-sm text-muted-foreground">
            Te mantendremos al tanto del estado de tu grabado y envío a través de WhatsApp o el correo electrónico que proporcionaste.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
