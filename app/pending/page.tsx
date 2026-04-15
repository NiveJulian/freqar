"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Clock, Info, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  getMercadoPagoPayloadFromSearchParams,
  shouldSyncMercadoPagoReturn,
  syncMercadoPagoReturn,
} from "@/lib/mercadopago"

function PendingContent() {
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
          status: mpPayload.status || "pending",
          collection_status: mpPayload.collection_status || "pending",
        })

        if (result?.success) {
          setSyncStatus("done")
          setSyncMessage(result.message || "El estado del pago fue registrado como pendiente.")
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
      <div className="rounded-full bg-amber-100 p-6 mb-8 animate-pulse">
        <Clock className="h-20 w-20 text-amber-600" />
      </div>

      <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl mb-6">
        Pago Pendiente
      </h1>

      <p className="text-xl text-muted-foreground max-w-xl mb-12 text-balance">
        {hasMercadoPagoData
          ? "Mercado Pago esta procesando tu transaccion y estamos registrando el estado de la venta."
          : "Mercado Pago esta procesando tu transaccion. Esto puede demorar unos minutos dependiendo del medio de pago utilizado."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button asChild size="lg" className="rounded-full px-8 flex-1 bg-foreground text-background py-7 text-lg font-bold">
          <Link href="/">
            Ir al inicio
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8 flex-1 py-7 text-lg font-bold">
          <Link href="/" className="flex items-center justify-center gap-2">
            Ver catalogo <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      <div className="mt-10 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-amber-100 p-2">
            <RefreshCcw className="h-5 w-5 text-amber-700" />
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

      <div className="mt-16 p-6 rounded-2xl bg-amber-50 border border-amber-100 max-w-lg">
        <Info className="h-8 w-8 text-amber-600 mx-auto mb-4" />
        <h3 className="font-bold text-lg mb-2 text-amber-900">Aviso importante</h3>
        <p className="text-sm text-amber-800">
          Una vez que el pago sea acreditado, recibiras una confirmacion automatica y daremos inicio a la produccion de tu pedido. No es necesario realizar ninguna otra accion.
        </p>
      </div>
    </div>
  )
}

export default function PendingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Cargando...</div>}>
        <PendingContent />
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
