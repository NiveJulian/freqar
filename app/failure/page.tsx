"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { MessageSquare, RefreshCcw, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  getMercadoPagoPayloadFromSearchParams,
  shouldSyncMercadoPagoReturn,
  syncMercadoPagoReturn,
} from "@/lib/mercadopago"

function FailureContent() {
  const searchParams = useSearchParams()
  const syncedRef = useRef(false)
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [syncMessage, setSyncMessage] = useState<string>("")

  const mpPayload = useMemo(
    () => getMercadoPagoPayloadFromSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  )

  useEffect(() => {
    if (!shouldSyncMercadoPagoReturn(mpPayload) || syncedRef.current) {
      return
    }

    syncedRef.current = true

    const syncPayment = async () => {
      setSyncStatus("loading")
      try {
        const result = await syncMercadoPagoReturn({
          ...mpPayload,
          status: mpPayload.status || "failure",
          collection_status: mpPayload.collection_status || "rejected",
        })

        if (result?.success) {
          setSyncStatus("done")
          setSyncMessage(result.message || "El pago fue registrado como pendiente en el CRM.")
        } else {
          setSyncStatus("error")
          setSyncMessage(result?.message || "No pudimos sincronizar el estado del pago.")
        }
      } catch (error: any) {
        setSyncStatus("error")
        setSyncMessage(error?.message || "No pudimos sincronizar el pago con el backend.")
      }
    }

    syncPayment()
  }, [mpPayload])

  const hasMercadoPagoData = Boolean(mpPayload.collection_id || mpPayload.payment_id || mpPayload.external_reference)

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="rounded-full bg-red-100 p-6 mb-8">
        <XCircle className="h-20 w-20 text-red-600" />
      </div>

      <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl mb-6">
        Pago no completado
      </h1>

      <p className="text-xl text-muted-foreground max-w-xl mb-12 text-balance">
        {hasMercadoPagoData
          ? "Recibimos el retorno de Mercado Pago y estamos registrando el estado para esa venta."
          : "Lo sentimos, ha ocurrido un problema al procesar tu pago. No se ha realizado ningun cargo en tu cuenta."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button asChild size="lg" className="rounded-full px-8 flex-1 bg-red-600 hover:bg-red-700 text-white py-7 text-lg font-bold">
          <Link href="/checkout" className="flex items-center justify-center gap-2">
            <RefreshCcw className="h-5 w-5" /> Reintentar pago
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8 flex-1 py-7 text-lg font-bold">
          <Link href="/" className="flex items-center justify-center gap-2">
            Volver al catalogo
          </Link>
        </Button>
      </div>

      <div className="mt-10 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-red-100 p-2">
            <RefreshCcw className="h-5 w-5 text-red-700" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Estado de la sincronizacion</h2>
            <p className="text-sm text-muted-foreground">
              {syncStatus === "loading"
                ? "Registrando la informacion del pago."
                : syncStatus === "done"
                  ? "La venta quedo sincronizada."
                  : syncStatus === "error"
                    ? "Hubo un problema al sincronizar el pago."
                    : "Esperando datos del pago."}
            </p>
          </div>
        </div>

        {syncMessage ? (
          <p className="mb-4 rounded-lg bg-secondary/60 px-4 py-3 text-sm text-foreground">
            {syncMessage}
          </p>
        ) : null}

        {hasMercadoPagoData ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Detail label="collection_id" value={mpPayload.collection_id} />
            <Detail label="payment_id" value={mpPayload.payment_id} />
            <Detail label="collection_status" value={mpPayload.collection_status} />
            <Detail label="status" value={mpPayload.status} />
            <Detail label="payment_type" value={mpPayload.payment_type} />
            <Detail label="external_reference" value={mpPayload.external_reference} />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
            No llegaron parametros de Mercado Pago en esta vuelta.
          </div>
        )}
      </div>

      <div className="mt-16 p-6 rounded-2xl bg-secondary/50 border border-border max-w-lg">
        <MessageSquare className="h-8 w-8 text-primary mx-auto mb-4" />
        <h3 className="font-bold text-lg mb-2">¿Necesitas ayuda?</h3>
        <p className="text-sm text-muted-foreground">
          Si crees que esto es un error o necesitas asistencia personalizada, puedes contactarnos por WhatsApp para finalizar tu compra de forma manual.
        </p>
      </div>
    </div>
  )
}

export default function FailurePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Cargando...</div>}>
        <FailureContent />
      </Suspense>
      <Footer />
    </main>
  )
}


function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 break-all text-sm text-foreground">{value || "-"}</p>
    </div>
  )
}
